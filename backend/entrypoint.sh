#!/bin/bash
set -e

echo "ENVIRONMENT: ${RAILS_ENV:-development}"

echo "Waiting for PostgreSQL..."

until pg_isready -h "$DATABASE_HOST" -U "$DATABASE_USER" > /dev/null 2>&1; do
  sleep 1
done

echo "PostgreSQL is ready!!!!"

echo "Installing missing gems (if any)"
bundle check || bundle install --jobs 4 --retry 3

echo "Preparing database"
bundle exec rails db:prepare
bundle exec rails db:seed

echo "Removing old Puma PID"
rm -f $APP_PATH/tmp/pids/server.pid

echo "Starting application"
exec "$@"
