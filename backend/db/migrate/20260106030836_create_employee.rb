class CreateEmployee < ActiveRecord::Migration[7.1]
  def change
    create_table :employees do |t|
      t.string :name
      t.integer :per_day_salary
      t.boolean :active, default: true
      t.string :position
      t.string :department
      t.string :phone_no
      t.references :company, null: false, foreign_key: true

      t.timestamps
    end
  end
end
