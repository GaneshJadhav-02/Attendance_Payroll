class CreateAdvancePayment < ActiveRecord::Migration[7.1]
  def change
    create_table :advance_payments do |t|
      t.references :employee, null: false, foreign_key: true
      t.integer :amount
      t.date :paid_on
      t.text :remarks

      t.timestamps
    end
  end
end
