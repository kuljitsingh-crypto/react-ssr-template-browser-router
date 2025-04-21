import React from "react";
import { CurrentUser } from "@src/util/APITypes";
import { Menu, MenuContent, MenuItem, MenuLabel } from "../Menu";
import { FormattedMsg, InlineTextButton, UserAvatar } from "@src/components";
import { GoSignOut } from "react-icons/go";
import css from "./Topbar.module.css";
import {
  UseDispatchType,
  useFetchStatusHandler,
  useNamedRedirect,
  UseSelectorType,
} from "@src/hooks";
import {
  selectLogoutError,
  selectLogoutStatus,
  userLogout,
} from "@src/globalReducers/auth.slice";
import { customConnect } from "../helperComponents/customConnect";
import { FETCH_STATUS } from "@src/custom-config";

const mapStateToProps = (selector: UseSelectorType) => {
  const logoutStatus = selector(selectLogoutStatus);
  const logoutError = selector(selectLogoutError);
  return { logoutStatus, logoutError };
};

const mapDispatchToProps = (dispatch: UseDispatchType) => ({
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
    callback: { succeeded: { handler: onLogoutSuccess } },
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
            isLoading={logoutStatus === FETCH_STATUS.loading}>
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
