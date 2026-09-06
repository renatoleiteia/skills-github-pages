<?php
/* ============================================================================
   ACELERO COMEX — enviar.php

   Recebe o formulário do site e manda o e-mail pelo próprio servidor da
   hospedagem. Substitui o serviço de terceiro que existia antes: o lead deixa
   de passar por fora e não há mais clique de ativação para fazer.

   ONDE COLOCAR
   ------------
   Na mesma pasta do index.html, dentro de public_html no cPanel.

   O QUE CONFERIR
   --------------
   $PARA      caixa que recebe os leads
   $DE        remetente. Precisa ser um endereço DO PRÓPRIO domínio, senão o
              servidor de destino trata como falsificação e joga em spam.
   ========================================================================== */

$PARA = 'contato@acelerocomex.com.br';
$DE   = 'site@acelerocomex.com.br';

header('Content-Type: application/json; charset=utf-8');

/* Só aceita POST: um GET aqui é robô varrendo o site. */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['ok' => false, 'erro' => 'metodo']));
}

$dados = json_decode(file_get_contents('php://input'), true);
if (!is_array($dados)) {
    http_response_code(400);
    exit(json_encode(['ok' => false, 'erro' => 'corpo']));
}

/* Isca invisível: campo que pessoa nenhuma vê. Preenchido, é robô — e
   respondemos sucesso para ele não tentar outro caminho. */
if (!empty($dados['_honey'])) {
    exit(json_encode(['ok' => true]));
}

/* Campos obrigatórios. A validação boa já aconteceu no navegador; esta é a
   que vale, porque o navegador pode ser contornado. */
foreach (['Nome', 'Empresa', 'E-mail', 'WhatsApp'] as $campo) {
    if (!isset($dados[$campo]) || trim($dados[$campo]) === '') {
        http_response_code(422);
        exit(json_encode(['ok' => false, 'erro' => 'campos']));
    }
}

$email = trim($dados['E-mail']);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    exit(json_encode(['ok' => false, 'erro' => 'email']));
}

/* Monta o corpo. Quebra de linha e dois-pontos são removidos das chaves e o
   assunto é limpo: é assim que se evita injeção de cabeçalho de e-mail. */
/* Função anônima clássica e substr() em vez de arrow function e
   str_starts_with(): as duas versões curtas exigem PHP 7.4 e 8.0, e o plano
   da hospedagem pode estar em 7.x. Assim roda de PHP 5.6 em diante. */
$limpo = function ($v) { return trim(str_replace(array("\r", "\n"), ' ', (string) $v)); };

$linhas = [];
foreach ($dados as $chave => $valor) {
    if (substr($chave, 0, 1) === '_') continue;   // _honey, _assunto e afins
    $linhas[] = $limpo($chave) . ': ' . $limpo($valor);
}
$linhas[] = 'IP: ' . (isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '-');
$corpo = implode("\n", $linhas);

$empresa = isset($dados['Empresa']) ? $dados['Empresa'] : '';
$assunto = $limpo('Site - analise de operacao: ' . $empresa);

$cabecalhos = implode("\r\n", [
    'From: ACELERO COMEX <' . $DE . '>',
    'Reply-To: ' . $limpo($dados['Nome']) . ' <' . $email . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'MIME-Version: 1.0',
]);

if (mail($PARA, $assunto, $corpo, $cabecalhos)) {
    exit(json_encode(['ok' => true]));
}

http_response_code(500);
exit(json_encode(['ok' => false, 'erro' => 'envio']));
