class ServiceCollaborator {
  static check =
    "SELECT * FROM collaborator WHERE email_collaborator=? AND phone=?";
  static register =
    "INSERT INTO collaborator VALUES(name_collaborator, password_collaborator, email_collaborator, gender, address_collaborator, phone, presenter_phone, status_collaborator, status_leader)";
  static login =
    "SELECT * FROM collaborator WHERE email_collaborator=? OR phone=?";
  static verify = "SELECT * FROM collaborator WHERE code_verify=?";
  static updateStatusVerify="UPDATE collaborator SET status_verify=? WHERE code_verify=?"
  static presenter =
    "UPDATE collaborator SET presenter_phone=?, status_collaborator=? WHERE id_collaborator=? AND phone=?";
}

module.exports = ServiceCollaborator;
