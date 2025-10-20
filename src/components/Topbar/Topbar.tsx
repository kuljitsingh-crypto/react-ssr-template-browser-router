import React from "react";
import { AppDispatch, AppSelect } from "@src/hooks";
import { customConnect } from "../helperComponents/customConnect";
import classNames from "classnames";
import { IoMdClose } from "react-icons/io";
import { RiMenu2Fill } from "react-icons/ri";
import css from "./Topbar.module.css";
import ThemeMenu from "./ThemeMenu";
import { changeTheme } from "@src/globalReducers/ui.slice";
import { Theme } from "@src/custom-config";
import ProfileMenu from "./ProfileMenu";
import { InlineTextButton } from "../UI/Button/Button";
import { useScreenDimension } from "../Page/pageHooks";
import { isMobileScreen, isTabletScreen } from "@src/util/functionHelper";
import HomeIcon from "../HomeIcon/HomeIcon";
import NamedLink from "../NamedLink/NamedLink";

const mapStateToProps = (select: AppSelect) => {
  const state = select({
    currentUser: "user.currentUser",
    isAuthenticated: "auth.isAuthenticated",
    theme: "ui.theme",
  });
  return state;
};
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  onChangeTheme: (theme: Theme) => dispatch(changeTheme(theme)),
});

type MapStateToProps = ReturnType<typeof mapStateToProps>;
type MapDispatchToProps = ReturnType<typeof mapDispatchToProps>;

type TopbarProps = {
  className?: string;
  showLeftChild?: boolean;
  hasLeftChild?: boolean;
  toggleLeftChild?: () => void;
} & MapStateToProps &
  MapDispatchToProps;
function TopbarComponent(props: TopbarProps) {
  const {
    currentUser,
    isAuthenticated,
    theme,
    showLeftChild,
    hasLeftChild,
    onChangeTheme,
    toggleLeftChild,
  } = props;
  const topbarClassName = classNames(css.root, {
    [css.hiddenRoot]: !isAuthenticated || !currentUser,
  });
  const { width } = useScreenDimension();
  const handleLeftChildToggle = () => {
    toggleLeftChild?.();
  };

  const showIcon = () => {
    if (isTabletScreen(width) || isMobileScreen(width)) {
      return <RiMenu2Fill className={css.sideBarIcon} />;
    }
    if (showLeftChild) {
      return <RiMenu2Fill className={css.sideBarIcon} />;
    }
    return <IoMdClose className={css.sideBarIcon} />;
  };

  return (
    <div className={topbarClassName}>
      {hasLeftChild ? (
        <InlineTextButton
          type='button'
          onClick={handleLeftChildToggle}
          buttonClassName={css.sideBarBtn}>
          {showIcon()}
        </InlineTextButton>
      ) : (
        <NamedLink name='Homepage'>
          <HomeIcon />
        </NamedLink>
      )}

      <div className='marginLeftAuto' />
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
