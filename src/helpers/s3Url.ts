export const profileImageUrl = (profileImage?: string | null) => {
  if (!profileImage) return null;
  if (profileImage.trim() === '') return null;
  if (profileImage.startsWith('http')) return profileImage;
  return `https://smart-talent-dev.s3.us-east-1.amazonaws.com/${profileImage}`;
};

export const documentUrl = (documentName?: string | null) => {
  if (!documentName) return null;
  if (documentName.trim() === '') return null;
  if (documentName.startsWith('http')) return documentName;
  return `https://smart-talent-dev.s3.us-east-1.amazonaws.com/${documentName}`;
};
