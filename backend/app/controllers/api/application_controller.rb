# frozen_string_literal: true

module Api
  class ApplicationController < ::ApplicationController
    include ActiveStorage::SetCurrent
    include ::Api::Errors

    protect_from_forgery with: :null_session
    respond_to :json
    self.responder = ::ApiResponder
  end
end
