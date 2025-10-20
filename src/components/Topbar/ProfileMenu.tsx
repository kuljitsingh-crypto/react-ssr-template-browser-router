import React from "react";
import { CurrentUser } from "@src/util/APITypes";
import { Menu, MenuContent, MenuItem, MenuLabel } from "../Menu";
import { FormattedMsg, InlineTextButton, UserAvatar } from "@src/components";
import { GoSignOut } from "react-icons/go";
import css from "./Topbar.module.css";
import {
  AppDispatch,
  useFetchStatusHandler,
  useNamedRedirect,
  AppSelect,
} from "@src/hooks";
import { userLogout } from "@src/globalReducers/auth.slice";
import { customConnect } from "../helperComponents/customConnect";

const mapStateToProps = (select: AppSelect) => {
  const state = select({
    logoutStatus: "auth.logoutStatus",
    logoutError: "auth.logoutError",
  });
  return state;
};

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  onUserLogout: () => dispatch(userLogout()),
});

type MapStateToProps = ReturnType<typeof mapStateToProps>;
type MapDispatchToProps = ReturnType<typeof mapDispatchToProps>;

type ProfileMenuProps = MapStateToProps &
  MapDispatchToProps & {
    currentUser: CurrentUser | null;
    isAuthenticated: boolean;
  };

function ProfileMenu({
  currentUser,
  logoutStatus,
  logoutError,
  isAuthenticated,
  onUserLogout,
}: ProfileMenuProps) {
  const navigate = useNamedRedirect();
  const handleLogout = () => {
    onUserLogout();
  };

  const onLogoutSuccess = () => {
    navigate("LoginPage", { replace: true });
  };

  useFetchStatusHandler({
    fetchStatus: logoutStatus,
    fetchError: logoutError,
    succeeded: onLogoutSuccess,
  });

  if (!currentUser || !isAuthenticated) {
    return null;
  }
  return (
    <Menu>
      <MenuLabel>
        <div className={css.profileLabel}>
          <UserAvatar
            userAvatar={{
              email: currentUser.email,
              displayName: currentUser.name,
              profileUrl: currentUser.profilePhoto,
            }}
            size='small'
          />
        </div>
      </MenuLabel>
      <MenuContent menuContentULClassname={css.profileMenuUl}>
        <MenuItem key='logout'>
          <InlineTextButton
            type='button'
            onClick={handleLogout}
            buttonClassName={css.logoutBtn}
            iconClassName={css.loadingIcon}
            isLoading={logoutStatus.isLoading}>
            <React.Fragment>
              <FormattedMsg id='Logout' className={"normalFont"} />
              <GoSignOut className={css.logoutIcon} />
            </React.Fragment>
          </InlineTextButton>
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}

export default customConnect(mapStateToProps, mapDispatchToProps)(ProfileMenu);
