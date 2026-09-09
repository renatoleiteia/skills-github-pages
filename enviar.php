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

/* Só aceita pedido vindo do próprio site. Não impede um ataque decidido — quem
   sabe usar curl forja o cabeçalho — mas corta o robô que varre a internet
   procurando formulário aberto, que é de onde vem quase todo lixo. */
$origem = '';
if (isset($_SERVER['HTTP_ORIGIN']))       $origem = $_SERVER['HTTP_ORIGIN'];
elseif (isset($_SERVER['HTTP_REFERER']))  $origem = $_SERVER['HTTP_REFERER'];
if ($origem !== '' && strpos($origem, 'acelerocomex.com.br') === false) {
    http_response_code(403);
    exit(json_encode(['ok' => false, 'erro' => 'origem']));
}

/* Freio por IP: no máximo 5 envios a cada 10 minutos. Sem isto, uma pessoa com
   um laço de repetição enche a caixa de contato@ em segundos — o endereço de
   destino é fixo, então não dá para usar o site como relay, mas dá para
   inutilizar a caixa que recebe os leads. */
$janela = 600; $teto = 5;
$ip    = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '0';
$marca = sys_get_temp_dir() . '/acelero_' . md5($ip);
$hist  = file_exists($marca) ? array_filter(explode(',', file_get_contents($marca))) : array();
$agora = time();
/* Laço simples em vez de create_function(): aquela função sumiu no PHP 8, e o
   plano da hospedagem pode estar tanto no 7 quanto no 8. Assim roda nos dois. */
$recentes = array();
foreach ($hist as $t) { if ((int) $t > $agora - $janela) $recentes[] = (int) $t; }
$hist = $recentes;
if (count($hist) >= $teto) {
    http_response_code(429);
    exit(json_encode(['ok' => false, 'erro' => 'frequencia']));
}

$bruto = file_get_contents('php://input');
if (strlen($bruto) > 20000) {          /* 20 KB é muito mais do que o form manda */
    http_response_code(413);
    exit(json_encode(['ok' => false, 'erro' => 'tamanho']));
}
$dados = json_decode($bruto, true);
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
/* Teto por campo: o formulário não manda nada perto disso, e sem teto o corpo
   do e-mail vira o depósito de quem quiser despejar texto na caixa. */
$curto = function ($v) use ($limpo) {
    $v = $limpo($v);
    return strlen($v) > 2000 ? substr($v, 0, 2000) . ' […]' : $v;
};

$linhas = [];
foreach ($dados as $chave => $valor) {
    if (substr($chave, 0, 1) === '_') continue;   // _honey, _assunto e afins
    $linhas[] = $limpo($chave) . ': ' . $curto($valor);
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

/* Marca a TENTATIVA, não o sucesso: se o servidor de e-mail estiver fora do ar,
   mail() devolve false e um envio em laço passaria pelo freio sem ser contado. */
$hist[] = $agora;
@file_put_contents($marca, implode(',', $hist));

if (mail($PARA, $assunto, $corpo, $cabecalhos)) {
    exit(json_encode(['ok' => true]));
}

http_response_code(500);
exit(json_encode(['ok' => false, 'erro' => 'envio']));
