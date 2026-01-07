# frozen_string_literal: true

require 'sidekiq/web'

Rails.application.routes.draw do
  devise_for :admins, only: []
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      namespace :admin do
        post 'auth/sign_in', to: 'auth#sign_in'
        get 'me', to: 'admins#me'
        delete 'auth/sign_out', to: 'auth#sign_out'
        resources :companies, only: [:index]
        resources :employees, only: %i[index create destroy] do
          post 'advance_payment', on: :collection
          post 'mark_present', on: :collection
        end
      end
    end
  end
end
