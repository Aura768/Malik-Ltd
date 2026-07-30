@echo off
setlocal

REM Repo-root wrapper so VSCode/OpenCode can run "opencode --port ####" successfully
REM without relying on PATH or the corrupted D:\ installation.

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"

call "%ROOT%\scripts\opencode.cmd" %*
exit /b %errorlevel%
