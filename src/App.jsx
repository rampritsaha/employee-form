import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Add, Delete } from "@mui/icons-material";
import axios from "axios";

const App = () => {
  // State Variables
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [team, setTeam] = useState("");
  const [applications, setApplications] = useState([
    { name: "", screen: "", features: [""] },
  ]);

  const [formData, setFormData] = useState();
  const [roles, setRoles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [applicationsList, setApplicationsList] = useState([]);
  const [screens, setScreens] = useState([]);
  const [features, setFeatures] = useState([]);

  // Fetch Data from API
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [rolesRes, teamsRes, applicationsRes, screensRes, featuresRes] =
          await Promise.all([
            axios.get("http://localhost:3004/roles"),
            axios.get("http://localhost:3004/teams"),
            axios.get("http://localhost:3004/applications"),
            axios.get("http://localhost:3004/screens"),
            axios.get("http://localhost:3004/features"),
          ]);
        setRoles(rolesRes.data);
        setTeams(teamsRes.data);
        setApplicationsList(applicationsRes.data);
        setScreens(screensRes.data);
        setFeatures(featuresRes.data);
      } catch (error) {
        console.error("Error fetching dropdown data", error);
      }
    };

    fetchDropdownData();
  }, []);

  // Handlers
  const addApplication = () => {
    setApplications((prev) => [
      ...prev,
      { name: "", screen: [], features: [] },
    ]);
  };

  const removeApplication = (index) => {
    setApplications((prev) => prev.filter((_, i) => i !== index));
  };

  const updateApplication = (index, field, value) => {
    const updatedApplications = [...applications];
    if (field === "name") {
      updatedApplications[index].screen = "";
      updatedApplications[index].features = [""];
    } else if (field === "screen") {
      updatedApplications[index].features = [""];
    }
    updatedApplications[index][field] = value;
    setApplications(updatedApplications);
  };

  const addFeature = (appIndex) => {
    const updatedApplications = [...applications];
    updatedApplications[appIndex].features.push("");
    setApplications(updatedApplications);
  };

  const removeFeature = (appIndex, featureIndex) => {
    const updatedApplications = [...applications];
    updatedApplications[appIndex].features = updatedApplications[
      appIndex
    ].features.filter((_, i) => i !== featureIndex);
    setApplications(updatedApplications);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { name, role, team, applications };
    console.log("Form Submitted:", formData);
    setFormData(formData);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={8}>
        <Card
          sx={{
            maxWidth: "500px",
          }}
        >
          <CardHeader title="User Details Form" />
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <Box
                sx={{
                  display: "flex",
                  gap: "16px",
                  marginBottom: "24px",
                  flexDirection: "column",
                  maxWidth: "500px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                />
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Team</InputLabel>
                  <Select
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    required
                  >
                    {teams.map((team) => (
                      <MenuItem key={team.id} value={team.id}>
                        {team.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Applications Section */}
                <div style={{ marginBottom: "16px" }}>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={addApplication}
                  >
                    Add Application
                  </Button>
                </div>

                {applications.map((app, appIndex) => (
                  <Card
                    key={appIndex}
                    style={{ marginBottom: "16px", padding: "16px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h4>Application {appIndex + 1}</h4>
                      <IconButton
                        color="error"
                        onClick={() => removeApplication(appIndex)}
                      >
                        <Delete />
                      </IconButton>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        marginBottom: "16px",
                      }}
                    >
                      <FormControl fullWidth>
                        <InputLabel>Application</InputLabel>
                        <Select
                          value={app.name}
                          onChange={(e) =>
                            updateApplication(appIndex, "name", e.target.value)
                          }
                        >
                          {applicationsList.map((application) => (
                            <MenuItem
                              key={application.id}
                              value={application.name}
                            >
                              {application.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth>
                        <InputLabel>Screen</InputLabel>
                        <Select
                          value={app.screen}
                          onChange={(e) =>
                            updateApplication(
                              appIndex,
                              "screen",
                              e.target.value
                            )
                          }
                          disabled={!app.name}
                        >
                          {screens?.map((screen) => (
                            <MenuItem key={screen.id} value={screen.name}>
                              {screen.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div>
                      <h5>Features</h5>
                      {app.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginBottom: 12,
                          }}
                        >
                          <FormControl fullWidth>
                            <InputLabel>Feature</InputLabel>
                            <Select
                              value={feature}
                              onChange={(e) => {
                                const updatedFeatures = [...app.features];
                                updatedFeatures[featureIndex] = e.target.value;
                                updateApplication(
                                  appIndex,
                                  "features",
                                  updatedFeatures
                                );
                              }}
                            >
                              {app.screen &&
                                features?.map((feat) => (
                                  <MenuItem key={feat.id} value={feat.name}>
                                    {feat.name}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                          <IconButton
                            color="error"
                            onClick={() =>
                              removeFeature(appIndex, featureIndex)
                            }
                          >
                            <Delete />
                          </IconButton>
                        </div>
                      ))}
                      <div style={{ marginTop: 10 }}>
                        <Button
                          variant="outlined"
                          startIcon={<Add />}
                          onClick={() => addFeature(appIndex)}
                          disabled={!app.screen}
                        >
                          Add Feature
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                <Button type="submit" variant="contained" fullWidth>
                  Submit
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={4}>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </Grid>
    </Grid>
  );
};

export default App;
