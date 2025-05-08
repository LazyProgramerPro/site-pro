function extractModelsAndCodenames(permissions) {
  const contentModels = new Set();
  const codenames = new Set();

  permissions.forEach((item) => {
    if (item.content_model) contentModels.add(item.content_model);
    if (item.codename) codenames.add(item.codename);
  });

  return {
    contentModels: Array.from(contentModels),
    codenames: Array.from(codenames),
  };
}

export default extractModelsAndCodenames;









