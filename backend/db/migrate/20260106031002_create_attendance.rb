class CreateAttendance < ActiveRecord::Migration[7.1]
  def change
    create_table :attendances do |t|
      t.date :date
      t.integer :status
      t.integer :paid_amount
      t.references :employee, null: false, foreign_key: true

      t.timestamps
    end
    add_index :attendances, [:employee_id, :date], unique: true
  end
end
