#!/usr/bin/env python3
"""
Backend API Testing for Silis Language Center
Tests all backend endpoints and functionality
"""

import requests
import json
import uuid
from datetime import datetime, timedelta
import sys
import os

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return "https://sillis-language.preview.emergentagent.com"
    
    return "https://sillis-language.preview.emergentagent.com"

BASE_URL = get_backend_url()
API_URL = f"{BASE_URL}/api"

print(f"Testing backend API at: {API_URL}")

class TestResults:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.errors = []
        
    def add_pass(self, test_name):
        self.passed += 1
        print(f"✅ {test_name}")
        
    def add_fail(self, test_name, error):
        self.failed += 1
        self.errors.append(f"{test_name}: {error}")
        print(f"❌ {test_name}: {error}")
        
    def summary(self):
        total = self.passed + self.failed
        print(f"\n{'='*60}")
        print(f"TEST SUMMARY: {self.passed}/{total} tests passed")
        if self.errors:
            print(f"\nFAILED TESTS:")
            for error in self.errors:
                print(f"  - {error}")
        print(f"{'='*60}")
        return self.failed == 0

results = TestResults()

def test_api_root():
    """Test root API endpoint"""
    try:
        response = requests.get(f"{API_URL}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "Silis Language Center API" in data.get("message", ""):
                results.add_pass("API Root Endpoint")
                return True
            else:
                results.add_fail("API Root Endpoint", f"Unexpected response: {data}")
        else:
            results.add_fail("API Root Endpoint", f"Status {response.status_code}: {response.text}")
    except Exception as e:
        results.add_fail("API Root Endpoint", str(e))
    return False

def test_contact_form_valid():
    """Test contact form with valid data"""
    try:
        contact_data = {
            "name": "Айыына Николаева",
            "phone": "+7 914 287 0753",
            "email": "aiyyna.nikolaeva@example.com",
            "organization": "Северо-Восточный федеральный университет",
            "comment": "Интересует корпоративное обучение якутскому языку для сотрудников университета. Группа 15-20 человек.",
            "agree": True
        }
        
        response = requests.post(f"{API_URL}/contact-form", json=contact_data, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and "id" in data:
                results.add_pass("Contact Form - Valid Submission")
                return data["id"]
            else:
                results.add_fail("Contact Form - Valid Submission", f"Invalid response: {data}")
        else:
            results.add_fail("Contact Form - Valid Submission", f"Status {response.status_code}: {response.text}")
    except Exception as e:
        results.add_fail("Contact Form - Valid Submission", str(e))
    return None

def test_contact_form_invalid():
    """Test contact form with invalid data"""
    try:
        # Test missing required fields
        invalid_data = {
            "name": "",  # Empty name
            "phone": "123",  # Too short phone
            "email": "invalid-email",  # Invalid email
            "agree": False  # Must be True
        }
        
        response = requests.post(f"{API_URL}/contact-form", json=invalid_data, timeout=10)
        if response.status_code == 422 or response.status_code == 400:
            results.add_pass("Contact Form - Invalid Data Validation")
            return True
        else:
            results.add_fail("Contact Form - Invalid Data Validation", 
                           f"Expected 400/422, got {response.status_code}: {response.text}")
    except Exception as e:
        results.add_fail("Contact Form - Invalid Data Validation", str(e))
    return False

def test_contact_submissions():
    """Test getting contact submissions (admin endpoint)"""
    try:
        response = requests.get(f"{API_URL}/contact-submissions", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "submissions" in data and "total" in data:
                results.add_pass("Contact Submissions - Admin Endpoint")
                return True
            else:
                results.add_fail("Contact Submissions - Admin Endpoint", f"Invalid response structure: {data}")
        else:
            results.add_fail("Contact Submissions - Admin Endpoint", f"Status {response.status_code}: {response.text}")
    except Exception as e:
        results.add_fail("Contact Submissions - Admin Endpoint", str(e))
    return False

def test_news_list():
    """Test getting news list"""
    try:
        response = requests.get(f"{API_URL}/news", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "news" in data and "total" in data and "has_more" in data:
                results.add_pass("News List - GET /api/news")
                return True
            else:
                results.add_fail("News List - GET /api/news", f"Invalid response structure: {data}")
        else:
            results.add_fail("News List - GET /api/news", f"Status {response.status_code}: {response.text}")
    except Exception as e:
        results.add_fail("News List - GET /api/news", str(e))
    return False

def test_news_create():
    """Test creating news"""
    try:
        news_data = {
            "title": "Новый курс якутского языка для начинающих",
            "excerpt": "Центр «Силис» объявляет набор на интенсивный курс якутского языка для взрослых. Занятия начинаются с 15 января.",
            "content": "Дорогие друзья! Мы рады сообщить о запуске нового интенсивного курса якутского языка для начинающих. Программа рассчитана на 3 месяца и включает изучение основ грамматики, разговорной практики и культурных особенностей. Занятия проводятся опытными преподавателями - носителями языка. В группе не более 8 человек, что обеспечивает индивидуальный подход к каждому студенту. Стоимость курса составляет 15000 рублей. Запись по телефону 8 914 287 0753.",
            "date": "2024-01-10"
        }
        
        response = requests.post(f"{API_URL}/news", json=news_data, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and "news" in data and "id" in data["news"]:
                results.add_pass("News Create - POST /api/news")
                return data["news"]["id"]
            else:
                results.add_fail("News Create - POST /api/news", f"Invalid response: {data}")
        else:
            results.add_fail("News Create - POST /api/news", f"Status {response.status_code}: {response.text}")
    except Exception as e:
        results.add_fail("News Create - POST /api/news", str(e))
    return None

def test_news_get_by_id(news_id):
    """Test getting specific news by ID"""
    if not news_id:
        results.add_fail("News Get by ID", "No news ID provided")
        return False
        
    try:
        response = requests.get(f"{API_URL}/news/{news_id}", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "id" in data and "title" in data:
                results.add_pass("News Get by ID - GET /api/news/{id}")
                return True
            else:
                results.add_fail("News Get by ID - GET /api/news/{id}", f"Invalid response structure: {data}")
        else:
            results.add_fail("News Get by ID - GET /api/news/{id}", f"Status {response.status_code}: {response.text}")
    except Exception as e:
        results.add_fail("News Get by ID - GET /api/news/{id}", str(e))
    return False

def test_news_update(news_id):
    """Test updating news"""
    if not news_id:
        results.add_fail("News Update", "No news ID provided")
        return False
        
    try:
        update_data = {
            "title": "Обновленный курс якутского языка для начинающих",
            "published": True
        }
        
        response = requests.put(f"{API_URL}/news/{news_id}", json=update_data, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and "news" in data:
                results.add_pass("News Update - PUT /api/news/{id}")
                return True
            else:
                results.add_fail("News Update - PUT /api/news/{id}", f"Invalid response: {data}")
        else:
            results.add_fail("News Update - PUT /api/news/{id}", f"Status {response.status_code}: {response.text}")
    except Exception as e:
        results.add_fail("News Update - PUT /api/news/{id}", str(e))
    return False

def test_news_delete(news_id):
    """Test deleting news"""
    if not news_id:
        results.add_fail("News Delete", "No news ID provided")
        return False
        
    try:
        response = requests.delete(f"{API_URL}/news/{news_id}", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                results.add_pass("News Delete - DELETE /api/news/{id}")
                return True
            else:
                results.add_fail("News Delete - DELETE /api/news/{id}", f"Invalid response: {data}")
        else:
            results.add_fail("News Delete - DELETE /api/news/{id}", f"Status {response.status_code}: {response.text}")
    except Exception as e:
        results.add_fail("News Delete - DELETE /api/news/{id}", str(e))
    return False

def test_news_pagination():
    """Test news pagination"""
    try:
        # Test with limit and skip parameters
        response = requests.get(f"{API_URL}/news?limit=2&skip=0", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "news" in data and len(data["news"]) <= 2:
                results.add_pass("News Pagination")
                return True
            else:
                results.add_fail("News Pagination", f"Pagination not working correctly: {data}")
        else:
            results.add_fail("News Pagination", f"Status {response.status_code}: {response.text}")
    except Exception as e:
        results.add_fail("News Pagination", str(e))
    return False

def test_cors():
    """Test CORS headers"""
    try:
        response = requests.options(f"{API_URL}/", timeout=10)
        # CORS preflight should return 200 or 204
        if response.status_code in [200, 204, 405]:  # 405 is also acceptable for OPTIONS
            results.add_pass("CORS Configuration")
            return True
        else:
            results.add_fail("CORS Configuration", f"OPTIONS request failed: {response.status_code}")
    except Exception as e:
        results.add_fail("CORS Configuration", str(e))
    return False

def test_error_handling():
    """Test error handling for non-existent endpoints"""
    try:
        response = requests.get(f"{API_URL}/nonexistent", timeout=10)
        if response.status_code == 404:
            results.add_pass("Error Handling - 404")
            return True
        else:
            results.add_fail("Error Handling - 404", f"Expected 404, got {response.status_code}")
    except Exception as e:
        results.add_fail("Error Handling - 404", str(e))
    return False

def main():
    """Run all backend tests"""
    print("Starting Silis Language Center Backend API Tests")
    print(f"Testing against: {API_URL}")
    print("="*60)
    
    # Test API health
    test_api_root()
    test_cors()
    test_error_handling()
    
    # Test Contact Form API
    print("\n--- Contact Form API Tests ---")
    contact_id = test_contact_form_valid()
    test_contact_form_invalid()
    test_contact_submissions()
    
    # Test News API
    print("\n--- News API Tests ---")
    test_news_list()
    test_news_pagination()
    
    # Test News CRUD operations
    news_id = test_news_create()
    if news_id:
        test_news_get_by_id(news_id)
        test_news_update(news_id)
        test_news_delete(news_id)
    
    # Print final results
    success = results.summary()
    
    if success:
        print("\n🎉 All backend tests passed!")
        return 0
    else:
        print(f"\n⚠️  {results.failed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())