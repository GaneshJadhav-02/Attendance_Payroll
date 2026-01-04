# frozen_string_literal: true

module UploadsHelper
  def fixture_base64_file_upload(relative_path)
    full_path = Rails.root.join(relative_path)
    content = File.read(full_path)
    "data:image/png;base64,#{Base64.encode64(content)}"
  end
end
