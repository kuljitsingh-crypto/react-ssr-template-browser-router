import React from "react";
import css from "./index.module.css";
import classNames from "classnames";

type UserAvatarProps = {
  userAvatar: {
    email: string;
    profileUrl?: string | null;
    displayName?: string | null;
  };
  size: "small" | "medium" | "large";
};

function UserAvatar(props: UserAvatarProps) {
  const {
    userAvatar: { email, profileUrl, displayName },
    size,
  } = props;
  const firstNameCh = (displayName || email || "ABC").charAt(0).toUpperCase();
  const avatarContainerClasses = classNames(css.root, {
    [css.smallContainer]: size === "small",
    [css.mediumContainer]: size === "medium",
    [css.largeContainer]: size === "large",
  });
  return (
    <div className={avatarContainerClasses}>
      {profileUrl ? (
        <img src={profileUrl} alt='profile' className={css.profileUrl} />
      ) : (
        <span className={css.displayName}>{firstNameCh}</span>
      )}
    </div>
  );
}

export default UserAvatar;
