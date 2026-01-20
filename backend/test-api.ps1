# Test Script for Student Questionnaire API
# Run this script to test all endpoints

Write-Host "`n=== Testing Student Questionnaire API ===" -ForegroundColor Cyan
Write-Host "Server: http://localhost:3000`n" -ForegroundColor Yellow

# Test 1: Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Green
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
    Write-Host "✅ Health check passed" -ForegroundColor Green
    $health | ConvertTo-Json
} catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 2: Register Student
Write-Host "`n2. Testing Student Registration..." -ForegroundColor Green
$registerBody = @{
    carnet = "20250505"
    password = "test123456"
} | ConvertTo-Json

try {
    $register = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "✅ Registration successful" -ForegroundColor Green
    $token = $register.token
    Write-Host "Token received: $($token.Substring(0, 20))..." -ForegroundColor Yellow
    $register | ConvertTo-Json
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "⚠️  Student already exists, trying login..." -ForegroundColor Yellow
        
        # Test 3: Login Student
        Write-Host "`n3. Testing Student Login..." -ForegroundColor Green
        $loginBody = @{
            carnet = "20250505"
            password = "test123456"
        } | ConvertTo-Json
        
        try {
            $login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
            Write-Host "✅ Login successful" -ForegroundColor Green
            $token = $login.token
            Write-Host "Token received: $($token.Substring(0, 20))..." -ForegroundColor Yellow
            $login | ConvertTo-Json
        } catch {
            Write-Host "❌ Login failed: $_" -ForegroundColor Red
            exit
        }
    } else {
        Write-Host "❌ Registration failed: $_" -ForegroundColor Red
        exit
    }
}

Start-Sleep -Seconds 1

# Test 4: Get Questions
Write-Host "`n4. Testing Get Questions..." -ForegroundColor Green
$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $questions = Invoke-RestMethod -Uri "http://localhost:3000/api/questions" -Method GET -Headers $headers
    Write-Host "✅ Questions retrieved: $($questions.count) questions found" -ForegroundColor Green
    $questions | ConvertTo-Json -Depth 3
    
    # Save first question ID for later
    if ($questions.questions.Count -gt 0) {
        $questionId = $questions.questions[0]._id
        Write-Host "`nUsing question ID: $questionId" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Failed to get questions: $_" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 5: Submit Answer
if ($questionId) {
    Write-Host "`n5. Testing Submit Answer..." -ForegroundColor Green
    $answerBody = @{
        questionId = $questionId
        answer = "verdadero"
    } | ConvertTo-Json
    
    try {
        $submitAnswer = Invoke-RestMethod -Uri "http://localhost:3000/api/answers" -Method POST -Body $answerBody -ContentType "application/json" -Headers $headers
        Write-Host "✅ Answer submitted successfully" -ForegroundColor Green
        $submitAnswer | ConvertTo-Json
    } catch {
        Write-Host "❌ Failed to submit answer: $_" -ForegroundColor Red
    }
    
    Start-Sleep -Seconds 1
    
    # Test 6: Get My Answers
    Write-Host "`n6. Testing Get My Answers..." -ForegroundColor Green
    try {
        $myAnswers = Invoke-RestMethod -Uri "http://localhost:3000/api/answers/my-answers" -Method GET -Headers $headers
        Write-Host "✅ Retrieved $($myAnswers.count) answers" -ForegroundColor Green
        $myAnswers | ConvertTo-Json -Depth 3
    } catch {
        Write-Host "❌ Failed to get my answers: $_" -ForegroundColor Red
    }
    
    Start-Sleep -Seconds 1
    
    # Test 7: Get Answers by Carnet
    Write-Host "`n7. Testing Get Answers by Carnet..." -ForegroundColor Green
    try {
        $studentAnswers = Invoke-RestMethod -Uri "http://localhost:3000/api/answers/20250505" -Method GET -Headers $headers
        Write-Host "✅ Retrieved answers for carnet 20250505" -ForegroundColor Green
        $studentAnswers | ConvertTo-Json -Depth 3
    } catch {
        Write-Host "❌ Failed to get student answers: $_" -ForegroundColor Red
    }
    
    Start-Sleep -Seconds 1
    
    # Test 8: Get Answer Stats
    Write-Host "`n8. Testing Get Answer Stats..." -ForegroundColor Green
    try {
        $stats = Invoke-RestMethod -Uri "http://localhost:3000/api/answers/stats/me" -Method GET -Headers $headers
        Write-Host "✅ Stats retrieved" -ForegroundColor Green
        $stats | ConvertTo-Json
    } catch {
        Write-Host "❌ Failed to get stats: $_" -ForegroundColor Red
    }
}

Write-Host "`n`n=== All Tests Completed ===" -ForegroundColor Cyan
Write-Host "Check the results above for any failures.`n" -ForegroundColor Yellow
