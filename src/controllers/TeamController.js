const pool = require("../config/database");
const { TeamModal } = require("../models/TeanModal");

const createTeam = (req, res) => {
  try {
    let id_collaborator = req.body.id_collaborator;
    pool.query(
      TeamModal.alreadyExistsTeam,
      [id_collaborator],
      (err, result) => {
        if (err) {
          console.log(err);
        } else if (result.length > 0) {
          return res.status(200).json({ message: "exists" });
        } else {
          pool.query(
            TeamModal.create,
            [1, "https://ecoop.vn/"],
            (err, result) => {
              if (err) {
                console.error(err);
              }
              if (result) {
                let id = result.insertId;
                pool.query(
                  TeamModal.createManyToMany,
                  [id, id_collaborator],
                  (err, data) => {
                    if (err) {
                      console.log(err);
                      return res.status(200).json({ message: "fails" });
                    }
                    if (data) {
                      pool.query(TeamModal.checkQuantity, [id], (err, data) => {
                        if (err) {
                          console.error(err);
                        }
                        if (data) {
                          pool.query(
                            TeamModal.updateLeader,
                            [1, id_collaborator],
                            (err, data) => {
                              if (err) {
                                console.error(err);
                              }
                              if (data) {
                                return res
                                  .status(200)
                                  .json({ message: "success" });
                              }
                            }
                          );
                        }
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json("fails");
  }
};

const joinTeam = (req, res) => {
  try {
  } catch (error) {}
};

const getAllTeam = (req, res) => {
  try {
    pool.query(TeamModal.allTeam, [], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(200).json({ message: "fails" });
      }
      if (result) {
        return res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "fails" });
  }
};

module.exports = { createTeam, joinTeam, getAllTeam };
