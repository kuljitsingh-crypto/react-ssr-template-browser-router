import React from "react";
import { UseDispatchType, UseSelectorType } from "@src/hooks";
import { customConnect } from "../helperComponents/customConnect";
import classNames from "classnames";
import { IoMdClose } from "react-icons/io";
import { RiMenu2Fill } from "react-icons/ri";
import css from "./Topbar.module.css";
import ThemeMenu from "./ThemeMenu";
import { changeTheme } from "@src/globalReducers/ui.slice";
import { Theme } from "@src/custom-config";
import ProfileMenu from "./ProfileMenu";
import { selectStateValue } from "@src/storeHelperFunction";
import { InlineTextButton } from "../UI/Button/Button";
import { useScreenDimension } from "../Page/pageHooks";
import { isMobileScreen, isTabletScreen } from "@src/util/functionHelper";
const mapStateToProps = (selector: UseSelectorType) => {
  const currentUser = selector(selectStateValue("user", "currentUser"));
  const isAuthenticated = selector(selectStateValue("auth", "isAuthenticated"));
  const theme = selector(selectStateValue("ui", "theme"));
  return { currentUser, isAuthenticated, theme };
};
const mapDispatchToProps = (dispatch: UseDispatchType) => ({
  onChangeTheme: (theme: Theme) => dispatch(changeTheme(theme)),
});

type MapStateToProps = ReturnType<typeof mapStateToProps>;
type MapDispatchToProps = ReturnType<typeof mapDispatchToProps>;

type TopbarProps = {
  className?: string;
  showLeftChild?: boolean;
  toggleLeftChild?: () => void;
} & MapStateToProps &
  MapDispatchToProps;
function TopbarComponent(props: TopbarProps) {
  const {
    currentUser,
    isAuthenticated,
    theme,
    showLeftChild,
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
      <InlineTextButton
        type='button'
        onClick={handleLeftChildToggle}
        buttonClassName={css.sideBarBtn}>
        {showIcon()}
      </InlineTextButton>
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
