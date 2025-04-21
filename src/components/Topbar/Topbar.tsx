import React from "react";
import { selectIsAuthenticated } from "@src/globalReducers/auth.slice";
import { selectCurrentUser } from "@src/globalReducers/user.slice";
import { UseDispatchType, UseSelectorType } from "@src/hooks";
import { customConnect } from "../helperComponents/customConnect";
import classNames from "classnames";
import { RiMenu2Fill } from "react-icons/ri";
import css from "./Topbar.module.css";
import ThemeMenu from "./ThemeMenu";
import { changeTheme, selectTheme } from "@src/globalReducers/ui.slice";
import { Theme } from "@src/custom-config";
import ProfileMenu from "./ProfileMenu";
const mapStateToProps = (selector: UseSelectorType) => {
  const currentUser = selector(selectCurrentUser);
  const isAuthenticated = selector(selectIsAuthenticated);
  const theme = selector(selectTheme);
  return { currentUser, isAuthenticated, theme };
};
const mapDispatchToProps = (dispatch: UseDispatchType) => ({
  onChangeTheme: (theme: Theme) => dispatch(changeTheme(theme)),
});

type MapStateToProps = ReturnType<typeof mapStateToProps>;
type MapDispatchToProps = ReturnType<typeof mapDispatchToProps>;

type TopbarProps = { className?: string } & MapStateToProps &
  MapDispatchToProps;
function TopbarComponent(props: TopbarProps) {
  const { currentUser, isAuthenticated, theme, onChangeTheme } = props;
  const topbarClassName = classNames(css.root, {
    [css.hiddenRoot]: !isAuthenticated || !currentUser,
  });

  return (
    <div className={topbarClassName}>
      <RiMenu2Fill />
      <div className={"marginLeftAuto"} />
      <ThemeMenu theme={theme} onChangeTheme={onChangeTheme} />
      <ProfileMenu
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}

export default customConnect(
  mapStateToProps,
  mapDispatchToProps
)(TopbarComponent);
