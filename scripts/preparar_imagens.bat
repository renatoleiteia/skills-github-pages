@echo off
chcp 65001 >nul
set PYTHONIOENCODING=utf-8
cd /d "%~dp0.."

if "%~1"=="" (
  echo.
  echo Uso: preparar_imagens.bat "CAMINHO\DA\PASTA\COM\AS\IMAGENS"
  echo.
  echo Exemplo:
  echo   preparar_imagens.bat "%USERPROFILE%\Downloads\imagens acelero comex"
  echo.
  pause
  exit /b 1
)

python "scripts\preparar_imagens.py" %*
if errorlevel 1 pause
