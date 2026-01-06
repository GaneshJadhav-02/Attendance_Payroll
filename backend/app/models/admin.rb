# frozen_string_literal: true

class Admin < ApplicationRecord
  include TokenAuthorizable

  devise :database_authenticatable, :recoverable,
         :rememberable, :validatable

  validates :username, presence: true, uniqueness: true, length: { minimum: 7, maximum: 20 }
  validates_format_of :username, with: /\A[a-zA-Z0-9]*\z/
  validates_format_of :email, with: Devise.email_regexp
  validate :password_strength, if: :password

  has_many :tokens, class_name: 'Admin::Token', dependent: :destroy
  attr_accessor :login

  # Function to override devise_mailer
  # @return AdminMailer mailer class
  def devise_mailer
    AdminMailer
  end

  # Overwriten function from {https://github.com/plataformatec/devise/wiki/How-To:-Allow-users-to-sign-in-using-their-username-or-email-address#overwrite-devises-find_for_database_authentication-method-in-user-model Devise}
  # to authenticate user with our own behavior
  # @return ActiveRecord::Relation of {Admin Admin model}
  def self.find_for_database_authentication(warden_conditions)
    conditions = warden_conditions.dup
    if login = conditions.delete(:login)
      where(conditions.to_h).where(['lower(username) = :value OR lower(email) = :value', { value: login.downcase }]).first
    elsif conditions.key?(:username) || conditions.key?(:email)
      where(conditions.to_h).first
    end
  end

  # Function to check password strength
  # @return [Hash]
  def password_strength
    errors.add(:password, :invalid) if password.present? && !password.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/)
  end
end
