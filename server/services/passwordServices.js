import Users from '../models/usersModels.js';
import bcrypt from 'bcrypt';
import changePasswordNotification from '../templates/change-password.js';
import sendEmail from '../utils/sendNodeMail.js';
import emailTemplate from '../templates/defaults/index.js';

const changePassword = async ({ emailAddress, oldPassword, newPassword }) => {
  const user = await Users.findOne({ emailAddress });
  if (!user) {
    throw new Error('User not found.');
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new Error('Old password is incorrect.');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();

  const emailContent = await emailTemplate(changePasswordNotification(user));

  await sendEmail(
    user.emailAddress,
    "Your Password Has Been Changed",
    emailContent
  );

  return { message: 'Password changed successfully.' };
};

export default {
  changePassword
}