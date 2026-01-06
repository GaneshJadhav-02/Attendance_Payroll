class Admin::Token < AuthToken
  self.table_name = 'admin_tokens'
  belongs_to :admin

  ##
  # Max amount of tokens that can be associated to an {Admin admin} instance
  MAX_COUNT = 3
end
