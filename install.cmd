@echo off
setlocal

for /D %%v in (*.*) do call :INSTALL_IT "%%v"
goto :DONE

:INSTALL_IT
if not exist %1 goto NODIR
cd %1
echo Installing %1 ...
if exist package.json call npm install
cd ..
goto :EOF
:NODIR
echo Folder %1 not found.
goto :EOF

:DONE
endlocal
echo.
pause
