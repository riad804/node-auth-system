import nodemailer from 'nodemailer';
import { sendVerificationEmail, sendAdminInvite } from './mail.service';

jest.mock('nodemailer');

describe('Email sending functions', () => {
  const sendMailMock = jest.fn();

  beforeAll(() => {
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });
  });

  beforeEach(() => {
    sendMailMock.mockClear();
    process.env.EMAIL_FROM = 'dev.riadul@gmail.com';
    process.env.EMAIL_PASS = 'rpxr locs kcbv bkdz';
  });

  it('should send verification email with correct parameters', async () => {
    const testEmail = 'developer.riad@gmail.com';
    const testToken = 'verifytoken123';

    await sendVerificationEmail(testEmail, testToken);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
      from: process.env.EMAIL_FROM,
      to: testEmail,
      subject: 'Verify your email',
      html: expect.stringContaining(`http://localhost:3000/api/auth/verify-email/${testToken}`),
    }));
  });

  it('should send admin invite email with correct parameters', async () => {
    const testEmail = 'developer.riad@gmail.com';
    const testToken = 'admintoken456';

    await sendAdminInvite(testEmail, testToken);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
      from: process.env.EMAIL_FROM,
      to: testEmail,
      subject: 'Set your password',
      html: expect.stringContaining(`http://localhost:3000/api/auth/set-password/${testToken}`),
    }));
  });
});
