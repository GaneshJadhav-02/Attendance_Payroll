module Build
  class DatabaseBuilder
    SEEDED_AT = Time.zone.parse("2025-12-01 00:00:00")

    DEPARTMENTS = [
      "Construction",
      "Engineering",
      "Operations",
      "Safety",
      "Procurement",
      "Accounts",
      "HR",
      "Site Management"
    ]

    COMPANY_NAMES = [
      "Tata Construction Pvt Ltd",
      "Reliance Infrastructure Ltd",
      "L&T Builders India",
      "Adani Engineering Services",
      "Mahindra EPC Infra",
      "Shapoorji Pallonji Group",
      "SHREEENATH",
      "SAROJ",
      "GALAXY"
    ]

    def self.run
      new.execute
    end

    def execute
      ActiveRecord::Base.transaction do
        destroy_data
        create_admin
        create_companies_with_employees
        create_attendance_records
      end
    end

    private

    def destroy_data
      [
        Attendance,
        AdvancePayment,
        Employee,
        Company,
        Admin
      ].each do |klass|
        Rails.logger.info "Destroying #{klass.name}"
        klass.destroy_all
        klass.connection.reset_pk_sequence!(klass.table_name)
      end
    end

    def create_admin
      superadmin = Admin.find_by(username: "superadmin")
      return if superadmin.present?

      Admin.create!(
        name: "John Doe",
        email: "superadmin@email.com",
        password: "Password@123",
        password_confirmation: "Password@123",
        username: "superadmin",
        created_at: SEEDED_AT,
        updated_at: SEEDED_AT
      )
    end

    def create_companies_with_employees
      indian_first_names = %w[
        Rahul Amit Suresh Ramesh Mahesh Vikas Anil Sunil
        Prakash Deepak Sanjay Ajay Rohit Nikhil Kiran
        Arjun Vinay Pankaj Manoj Ashok Ravi
      ]

      indian_last_names = %w[
        Sharma Verma Patil Reddy Iyer Naik Kulkarni
        Chavan Deshmukh Rao Mehta Gupta Jain Agarwal
      ]

      COMPANY_NAMES.each do |company_name|
        company = Company.create!(
          name: company_name,
          phone_number: random_phone,
          email: company_email(company_name),
          created_at: SEEDED_AT,
          updated_at: SEEDED_AT
        )

        Rails.logger.info "Created Company: #{company.name}"

        rand(20..30).times do
          name = "#{indian_first_names.sample} #{indian_last_names.sample}"

          company.employees.create!(
            name: name,
            department: DEPARTMENTS.sample,
            per_day_salary: rand(600..1500),
            created_at: SEEDED_AT,
            updated_at: SEEDED_AT
          )
        end
      end
    end

    def create_attendance_records
      Rails.logger.info "Creating attendance records from Dec 1, 2025 to today"

      start_date = SEEDED_AT.to_date
      end_date = Date.current

      Employee.find_each do |employee|
        (start_date..end_date).each do |date|
          next if date.sunday?
          next unless rand < 0.8

          Attendance.find_or_create_by!(
            employee: employee,
            date: date
          ) do |attendance|
            attendance.paid_amount = employee.per_day_salary
            attendance.created_at = date.beginning_of_day
            attendance.updated_at = date.beginning_of_day
          end
        end
      end
    end

    # ---------- Helpers ----------

    def random_phone
      "9#{rand(100000000..999999999)}"
    end

    def company_email(name)
      slug = name.downcase.gsub(/\s+/, "")
      "contact@#{slug}.com"
    end
  end
end
