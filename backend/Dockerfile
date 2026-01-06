FROM ruby:3.3.3

# Environment variables
ENV APP_PATH=/var/app \
    BUNDLE_VERSION=2.5.19 \
    BUNDLE_PATH=/usr/local/bundle \
    RAILS_LOG_TO_STDOUT=true \
    RAILS_PORT=3000

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential \
  git \
  postgresql-client \
  libpq-dev \
  nodejs \
  npm \
  yarn \
  tzdata \
  less \
  imagemagick \
  libvips-dev \
  ca-certificates \
  curl \
  && rm -rf /var/lib/apt/lists/*

# Install bundler
RUN gem install bundler -v "$BUNDLE_VERSION"

# Set working directory
WORKDIR $APP_PATH

# Copy Gemfiles first (Docker cache optimization)
COPY Gemfile Gemfile.lock ./

# Install gems
RUN bundle update net-pop
RUN bundle install --force
# Copy application code
COPY . ./

# Copy entrypoint
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE $RAILS_PORT

# Proper entrypoint + command
ENTRYPOINT ["entrypoint.sh"]
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3000"]
