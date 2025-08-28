/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { renderWithProviders } from '../../test-utils/render.js';
import { waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { FolderTrustDialog, FolderTrustChoice } from './FolderTrustDialog.js';
import * as process from 'node:process';

vi.mock('process', async () => {
  const actual = await vi.importActual('process');
  return {
    ...actual,
    exit: vi.fn(),
  };
});

describe('FolderTrustDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the dialog with title and description', () => {
    const { lastFrame } = renderWithProviders(
      <FolderTrustDialog onSelect={vi.fn()} parentFolder="parent" />,
    );

    expect(lastFrame()).toContain('Do you trust this folder?');
    expect(lastFrame()).toContain(
      'Trusting a folder allows Gemini to execute commands it suggests.',
    );
  });

  it('should call onSelect with DO_NOT_TRUST when escape is pressed and not restarting', async () => {
    const onSelect = vi.fn();
    const { stdin } = renderWithProviders(
      <FolderTrustDialog
        onSelect={onSelect}
        isRestarting={false}
        parentFolder="parent"
      />,
    );

    stdin.write('\x1b'); // escape key

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledWith(FolderTrustChoice.DO_NOT_TRUST);
    });
  });

  it('should not call onSelect when escape is pressed and is restarting', async () => {
    const onSelect = vi.fn();
    const { stdin } = renderWithProviders(
      <FolderTrustDialog
        onSelect={onSelect}
        isRestarting={true}
        parentFolder="parent"
      />,
    );

    stdin.write('\x1b'); // escape key

    await waitFor(() => {
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  it('should display restart message when isRestarting is true', () => {
    const { lastFrame } = renderWithProviders(
      <FolderTrustDialog
        onSelect={vi.fn()}
        isRestarting={true}
        parentFolder="parent"
      />,
    );

    expect(lastFrame()).toContain(
      'To see changes, Gemini CLI must be restarted',
    );
  });

  it('should call process.exit when "r" is pressed and isRestarting is true', async () => {
    const { stdin } = renderWithProviders(
      <FolderTrustDialog
        onSelect={vi.fn()}
        isRestarting={true}
        parentFolder="parent"
      />,
    );

    stdin.write('r');

    await waitFor(() => {
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  it('should not call process.exit when "r" is pressed and isRestarting is false', async () => {
    const { stdin } = renderWithProviders(
      <FolderTrustDialog
        onSelect={vi.fn()}
        isRestarting={false}
        parentFolder="parent"
      />,
    );

    stdin.write('r');

    await waitFor(() => {
      expect(process.exit).not.toHaveBeenCalled();
    });
  });

  it('should display the parent folder name in the options', () => {
    const { lastFrame } = renderWithProviders(
      <FolderTrustDialog onSelect={vi.fn()} parentFolder="my-parent-folder" />,
    );

    expect(lastFrame()).toContain('Trust parent folder (my-parent-folder)');
  });
});
