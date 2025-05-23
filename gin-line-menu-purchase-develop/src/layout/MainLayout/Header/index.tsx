import React from "react";
import { AppBar, Badge, IconButton, Toolbar, Typography } from "@mui/material";
import {
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import { removeUserToken } from "@/utils/helper";
import { AUTH_SET_CURRENT_USER } from "@/redux/reducers/users/auth.slice";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/redux/hook";
// Header Main Layout
export default function Header() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const logout = () => {
    removeUserToken();
    dispatch(AUTH_SET_CURRENT_USER({}));
  };

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        width: "100%",
      }}
    >
      <Toolbar
        sx={{
          pr: 3,
        }}
      >
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          {t("header.Dashboard")}
        </Typography>
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit" onClick={logout}>
          <PersonIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
