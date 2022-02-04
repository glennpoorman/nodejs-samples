@echo off
setlocal

for /D %%v in (*.*) do call :CLEAN_IT "%%v"
goto :DONE

:CLEAN_IT
if not exist %1 goto NODIR
cd %1
echo Cleaning %1 ...
if exist node_modules\nul rmdir /s /q node_modules
cd ..
goto :EOF
:NODIR
echo Folder %1 not found.
goto :EOF

:DONE
endlocal
echo.
pause
