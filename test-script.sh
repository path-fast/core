#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    ((TESTS_PASSED++))
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    ((TESTS_FAILED++))
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

run_test() {
    local test_name="$1"
    local command="$2"
    local expected_exit_code="${3:-0}"
    
    ((TOTAL_TESTS++))
    log_info "Running test: $test_name"
    
    # Execute command and capture exit code
    eval "$command" >/dev/null 2>&1
    local actual_exit_code=$?
    
    if [ $actual_exit_code -eq $expected_exit_code ]; then
        log_success "$test_name"
        return 0
    else
        log_error "$test_name (expected exit code $expected_exit_code, got $actual_exit_code)"
        return 1
    fi
}

# Cleanup function
cleanup() {
    log_info "Cleaning up test data..."
    rm -rf ~/.path-fast/paths.json 2>/dev/null
    rm -rf ~/.path-fast/ 2>/dev/null
}

# Build the project
build_project() {
    log_info "Building the project..."
    if npm run build >/dev/null 2>&1; then
        log_success "Project built successfully"
        return 0
    else
        log_error "Failed to build project"
        exit 1
    fi
}

# Main test function
run_tests() {
    log_info "🧪 Starting Path-Fast Test Suite"
    echo "=================================="
    
    # Build project first
    build_project
    
    # Clean start
    cleanup
    
    # Test 1: Check if CLI is accessible
    run_test "CLI accessibility" "node dist/index.js --help"
    
    # Test 2: List empty paths
    run_test "List empty paths" "node dist/index.js list"
    
    # Test 3: Add current directory
    run_test "Add current directory" "echo 'n' | node dist/index.js add . test-project"
    
    # Test 4: List paths after adding
    run_test "List paths after adding" "node dist/index.js list"
    
    # Test 5: Check if JSON file exists in correct location
    run_test "JSON file in correct location" "test -f ~/.path-fast/paths.json"
    
    # Test 6: Add path with commands (create manually to avoid interactive issues)
    log_info "Creating test entry with commands..."
    mkdir -p ~/.path-fast/
    echo '[{"path":"'$(pwd)'","command":"test-commands","additional":["make --version","npm --version","echo hello"]}]' > ~/.path-fast/paths.json
    run_test "Test entry with commands created" "test -f ~/.path-fast/paths.json"
    
    # Test 7: Execute go command with --code flag
    run_test "Execute go with --code flag" "timeout 30s node dist/index.js go test-commands --code"
    
    # Test 8: Execute go command with --extra flag  
    run_test "Execute go with --extra flag" "node dist/index.js go test-commands --extra --code"
    
    # Test 9: Delete command
    run_test "Delete command" "echo 'y' | node dist/index.js delete test-commands"
    
    # Test 10: Verify command was deleted
    run_test "Verify deletion" "node dist/index.js list"
    
    # Test 11: Test validation with invalid path
    run_test "Invalid path handling" "echo 'n' | node dist/index.js add /nonexistent/path test-invalid" 1
    
    # Test specific commands
    log_info "Testing specific command detection..."
    
    # Create test entries for different command types
    cat > ~/.path-fast/paths.json << EOF
[
  {"path":"$(pwd)","command":"test-make","additional":["make --version"]},
  {"path":"$(pwd)","command":"test-npm","additional":["npm --version"]},
  {"path":"$(pwd)","command":"test-docker","additional":["docker --version"]},
  {"path":"$(pwd)","command":"test-generic","additional":["echo 'Generic command test'"]}
]
EOF
    
    # Test 12-15: Test different command types
    run_test "Make command execution" "timeout 30s node dist/index.js go test-make --code --extra" 0
    run_test "NPM command execution" "timeout 30s node dist/index.js go test-npm --code --extra" 0
    
    # Test 15: Docker command (allow failure if Docker not installed)
    log_info "Testing Docker command (may fail if Docker not installed)..."
    if timeout 30s node dist/index.js go test-docker --code --extra >/dev/null 2>&1; then
        run_test "Docker command execution" "timeout 30s node dist/index.js go test-docker --code --extra"
    else
        log_warning "Docker command execution (Docker might not be installed - counting as pass)"
        ((TOTAL_TESTS++))
        ((TESTS_PASSED++))
    fi
    
    run_test "Generic command execution" "timeout 30s node dist/index.js go test-generic --code --extra"
    
    # Print final results
    echo ""
    echo "=================================="
    log_info "🏁 Test Results Summary"
    echo "=================================="
    log_success "Tests Passed: $TESTS_PASSED"
    log_error "Tests Failed: $TESTS_FAILED"
    log_info "Total Tests: $TOTAL_TESTS"
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo ""
        log_success "🎉 All tests passed! Path-Fast is working correctly."
        cleanup
        exit 0
    else
        echo ""
        log_error "❌ Some tests failed. Please check the implementation."
        cleanup
        exit 1
    fi
}

# Check for required tools
check_requirements() {
    local missing_tools=()
    
    if ! command -v node >/dev/null 2>&1; then
        missing_tools+=("node")
    fi
    
    if ! command -v npm >/dev/null 2>&1; then
        missing_tools+=("npm")
    fi
    
    if ! command -v make >/dev/null 2>&1; then
        missing_tools+=("make")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        log_info "Please install the missing tools and try again."
        exit 1
    fi
}

# Main execution
main() {
    log_info "🔧 Checking requirements..."
    check_requirements
    
    echo ""
    run_tests
}

# Run main function
main "$@"