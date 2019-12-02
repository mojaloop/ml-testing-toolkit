#!/usr/bin/env bash

###
# integration-runner.sh
#
# A basic integration test runner using docker-compose
###

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

##
# TEST_MODE
# Options: 
# - default   runs the tests as usual
# - wait      sets up the docker-compose environment, but don't do anything (this allows for repeat tests)
# - rm        same as default, but stops and removes docker-compose containers afterwards
###
TEST_MODE="${TEST_MODE:-"rm"}"

# Test output on host machine
RESULTS_DIR="${RESULTS_DIR:-"/tmp"}"

function startDocker() {
  docker-compose \
    -f ${DIR}/../docker-compose.yml \
    -f ${DIR}/../docker-compose.integration.yml \
    up -d
}

function waitForDocker() {
  echo 'Waiting for docker services to be healthy'
  HEALTHY_COUNT=$(docker ps | grep "healthy" | wc -l)
  EXPECTED_HEALTHY_COUNT=2
  EXPECTED_SERVICE_COUNT=2
  while [ $(docker ps | grep "Up" | wc -l) -lt $EXPECTED_HEALTHY_COUNT ]; do
    TOTAL_SERVICES=$(docker ps | grep "mojaloop-testing-toolkit_*" | wc -l)
    # exit early if we don't have the required services
    if [ ${TOTAL_SERVICES} -lt ${EXPECTED_SERVICE_COUNT} ]; then
      echo 'Not all docker-compose services are running. Check the logs and try again.'
      exit 1
    fi

    echo "."
    sleep 5
  done
}

function runTests() {
  docker exec -it mojaloop-testing-toolkit-int sh -c "npm run test:int"
}

function tearDown() {
  docker-compose \
    -f ${DIR}/../docker-compose.yml \
    -f ${DIR}/../docker-compose.integration.yml \
    stop
  docker-compose \
    -f ${DIR}/../docker-compose.yml \
    -f ${DIR}/../docker-compose.integration.yml \
    rm -f
}

startDocker
waitForDocker

case ${TEST_MODE} in
  default)
    runTests
  ;;

  wait)
    echo 'Running tests in `wait` mode'
  ;;

  rm)
    runTests
    EXIT_RESULT=$?
    tearDown
    exit ${EXIT_RESULT}
  ;;

  *)
    echo "Unsupported TEST_MODE: ${TEST_MODE}"
    exit 1
esac
  
