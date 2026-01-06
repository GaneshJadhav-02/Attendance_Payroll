class CreateAdminToken < ActiveRecord::Migration[7.1]
  def change
    create_table :admin_tokens do |t|
      t.string :value, null: false
      t.datetime :expired_at, null: false
      t.integer :admin_id, index: true, null: false
      t.timestamps
    end

    add_index :admin_tokens, :value, unique: true
  end
end
