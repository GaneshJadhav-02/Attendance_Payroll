# frozen_string_literal: true

class AddDeviseToAdmins < ActiveRecord::Migration[7.1]
  def self.up
    create_table :admins do |t|
      ## Database authenticatable
      t.string :name
      t.string :avatar
      t.string :username,           null: false, default: ""
      t.string :email,              null: false, default: ""
      t.string :encrypted_password, null: false, default: ""

      ## Recoverable
      t.string   :reset_password_token
      t.datetime :reset_password_sent_at

      ## Rememberable
      t.datetime :remember_created_at

      ## Trackable
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at
      t.timestamps null: false
    end

    add_index :admins, :email,                unique: true
    add_index :admins, :username,             unique: true
    add_index :admins, :reset_password_token, unique: true
  end

  def self.down
    raise ActiveRecord::IrreversibleMigration
  end
end
