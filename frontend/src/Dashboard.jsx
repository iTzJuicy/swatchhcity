import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  IconButton,
  Grid,
  Card,
  Avatar,
  Divider,
  ListItemButton,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import InsightsIcon from "@mui/icons-material/Insights";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StarIcon from "@mui/icons-material/Star";
import TimelineIcon from "@mui/icons-material/Timeline";
import RecyclingIcon from "@mui/icons-material/Recycling";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useLocation } from "react-router-dom";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const drawerWidth = 240;

// 🎨 Palette
const palette = {
  primary: "#2E8B57",
  secondary: "#4682B4",
  accent: "#FFD700",
  background: "#F8F9FA",
  text: "#343A40",
  highlight: "#20C997",
};

const modules = [
  { title: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { title: "Citizen Reports", icon: <ReportProblemIcon />, path: "/citizen-reports" },
  { title: "Sustainability Metrics", icon: <InsightsIcon />, path: "/sustainability-metrics" },
  { title: "Transparency Portal", icon: <VisibilityIcon />, path: "/transparency-portal" },
  { title: "Green Credits", icon: <StarIcon />, path: "/green-credits" },
  { title: "Waste Forecasting", icon: <TimelineIcon />, path: "/waste-forecasting" },
  { title: "Segregation & Recycling", icon: <RecyclingIcon />, path: "/segregation-recycling" },
];

// Demo chart data
const trendData = [
  { month: "Jan", reports: 30 },
  { month: "Feb", reports: 45 },
  { month: "Mar", reports: 60 },
  { month: "Apr", reports: 40 },
  { month: "May", reports: 75 },
];

const pieData = [
  { name: "Plastic", value: 45 },
  { name: "Metal", value: 25 },
  { name: "Organic", value: 20 },
  { name: "Other", value: 10 },
];

const COLORS = [palette.primary, palette.secondary, palette.accent, palette.highlight];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <Box sx={{ height: "100%", bgcolor: palette.secondary, color: "white" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          🌍 Smart City
        </Typography>
      </Toolbar>
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />
      <List>
        {modules.map((mod, index) => (
          <ListItemButton
            key={index}
            selected={location.pathname === mod.path}
            onClick={() => navigate(mod.path)}
            sx={{
              color: "white",
              "&.Mui-selected": { backgroundColor: "#315f7a", borderLeft: 4px solid ${palette.accent} },
              "&:hover": { backgroundColor: "#386890" },
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>{mod.icon}</ListItemIcon>
            <ListItemText primary={mod.title} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: calc(100% - ${drawerWidth}px) },
          ml: { sm: ${drawerWidth}px },
          bgcolor: palette.primary,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: palette.text }} />,
              sx: { bgcolor: "white", borderRadius: 1 },
            }}
            sx={{ flexGrow: 1, maxWidth: 400, mr: 2 }}
          />
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        {/* Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: palette.secondary,
              color: "white",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: palette.background,
          p: 3,
          color: palette.text,
          width: { sm: calc(100% - ${drawerWidth}px) },
        }}
      >
        <Toolbar />
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Welcome Back, Admin 👋
        </Typography>

        {/* KPI Cards */}
        <Grid container spacing={3}>
          {[
            { label: "Active Reports", value: "128", color: "error.main", icon: <ReportProblemIcon /> },
            { label: "Recycling Rate", value: "72%", color: palette.highlight, icon: <RecyclingIcon /> },
            { label: "CO₂ Saved", value: "1.2k Tons", color: palette.primary, icon: <InsightsIcon /> },
            { label: "Green Credits", value: "845", color: palette.accent, icon: <StarIcon /> },
          ].map((kpi, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card
                sx={{
                  p: 2,
                  textAlign: "center",
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
                }}
              >
                <Avatar sx={{ bgcolor: kpi.color, mx: "auto", mb: 1 }}>{kpi.icon}</Avatar>
                <Typography variant="h6">{kpi.label}</Typography>
                <Typography variant="h4" sx={{ color: kpi.color, fontWeight: "bold" }}>
                  {kpi.value}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom>
                Monthly Reports Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <Line type="monotone" dataKey="reports" stroke={palette.primary} strokeWidth={2} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom>
                Waste Composition
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                    {pieData.map((entry, index) => (
                      <Cell key={cell-${index}} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}