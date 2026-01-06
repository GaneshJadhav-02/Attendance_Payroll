module Build
  class DatabaseBuilder
    def self.run
      new.execute
    end

    def execute
      ActiveRecord::Base.transaction do
        destroy_data
        create_admin
      end
    end

    private
    
    def destroy_data
      [
        Admin,
      ].each do |klass|
        Rails.logger.info "Destroying #{klass.name}"
        klass.destroy_all
        klass.connection.reset_pk_sequence!(klass.table_name)
      end
    end
    
    def create_admin
      superadmin = Admin.find_by(username: 'superadmin')
      return if superadmin.present?

      Admin.create!(
        name: 'John Doe',
        email: 'superadmin@email.com',
        password: 'Password@123',
        password_confirmation: 'Password@123',
        username: 'superadmin')
    end
  end
end
