# frozen_string_literal: true

module V1
  module AdvancePayments
    class Create < ApplicationInteraction
      integer :employee_id
      integer :amount
      date    :paid_on
      string  :remarks, default: nil

      def execute
        employee = Employee.find(employee_id)

        @payment = transactional_create!(employee.advance_payments, advance_payment_params)
      end

      def to_model
        @payment
      end

      private

      def advance_payment_params
        inputs.except(:employee_id)
      end
    end
  end
end
