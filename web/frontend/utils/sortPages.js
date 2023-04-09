function sortPages(array = [], sortBy) {
  switch (sortBy) {
    case "newest":
      array.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      break;
    case "oldest":
      array.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      break;
    case "az":
      array.sort((a, b) => (a.title >= b.title ? 1 : -1));
      break;
    case "za":
      array.sort((a, b) => (a.title >= b.title ? -1 : 1));
      break;
  }
}

export default sortPages;
