export const defaultClaims = (typeUser) => {
  switch (typeUser) {
    case "OBSERVER":
      return ["VIEW_CLASS", "UPDATE_USER", "GET_ROOMS"];
    case "STUDENT":
      return [
        "VIEW_CLASS",
        "VIEW_STREAM_CLASS",
        "VIEW_CLASS",
        "UPDATE_USER",
        "GET_GROUPS",
        "GET_USERS",
        "GET_ROOMS",
      ];
    case "TEACHER":
      return [
        "CREATE_CLASS",
        "VIEW_CLASS",
        "VIEW_STREAM_CLASS",
        "EDIT_CLASS",
        "VIEW_CLASS",
        "UPDATE_USER",
        "CREATE_USER",
        "CREATE_EDUCATIONAL_INSTITUTION",
        "GET_EDUCATIONAL_INSTITUTION",
        "UPDATE_EDUCATIONAL_INSTITUTION",
        "CREATE_GROUPS",
        "GET_ROOMS",
        "GET_GROUPS",
        "GET_USERS",
      ];
    case "ADMIN":
      return [
        "CREATE_CLASS",
        "VIEW_CLASS",
        "VIEW_STREAM_CLASS",
        "EDIT_CLASS",
        "VIEW_CLASS",
        "GET_USERS",
        "UPDATE_USER",
        "CREATE_USER",
        "CREATE_EDUCATIONAL_INSTITUTION",
        "GET_EDUCATIONAL_INSTITUTION",
        "UPDATE_EDUCATIONAL_INSTITUTION",
        "CREATE_GROUPS",
        "UPDATE_GROUPS",
        "CREATE_ROOMS",
        "UPDATE_ROOMS",
        "GET_ROOMS",
        "GET_GROUPS",
      ];
    default:
      return ["UPDATE_USER"];
  }
};
