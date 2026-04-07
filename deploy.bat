@echo off
git add .
git status
set /p msg="Enter commit message: "
git commit -m "%msg%"
for /f "delims=" %%b in ('git branch --show-current') do set BRANCH=%%b
if "%BRANCH%"=="" (
  echo Could not detect current branch.
  pause
  exit /b 1
)
git push -u origin %BRANCH%
pause
