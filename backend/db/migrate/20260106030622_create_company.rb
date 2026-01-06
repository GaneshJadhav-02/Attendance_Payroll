class CreateCompany < ActiveRecord::Migration[7.1]
  def change
    create_table :companies do |t|
      t.string :name
      t.text :address
      t.string :phone_number
      t.string :email

      t.timestamps
    end
  end
end
