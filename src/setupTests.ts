import '@testing-library/jest-dom';
import * as crypto from 'crypto';
import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;

// @ts-ignore We don't use `subtle.generateKey` so we don't care about this mismatch error
global.crypto = crypto;
