// Copyright 2017-2024 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Network } from './types.js';

import React, { useCallback } from 'react';

import { ChainImg, styled } from '@polkadot/react-components';

import store from 'store';

interface Props {
  affinity?: string; // unused - previous selection
  apiUrl: string;
  className?: string;
  setApiUrl: (network: string, apiUrl: string) => void;
  settings: any;
  hasUrlChanged: boolean;
  value: Network;
}

function NetworkDisplay({ apiUrl,  setApiUrl, settings, hasUrlChanged, value: { isChild, isUnreachable, name, nameRelay: relay, providers, ui } }: Props): React.ReactElement<Props> {

  const _selectUrl = useCallback(
    () => {
      const filteredProviders = providers.filter(({ url }) => !url.startsWith('light://'));

      return setApiUrl(name, filteredProviders[Math.floor(Math.random() * filteredProviders.length)].url);
    },
    [name, providers, setApiUrl]
  );

  const onApply = useCallback(
    () => {
      store.set('localFork', '');
      settings.set({ ...(settings.get()), apiUrl });
      console.log('==========================', apiUrl, relay);
      window.location.assign(`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(apiUrl)}${window.location.hash}`);
      // if (!hasUrlChanged) {
      //   window.location.reload();
      // }
    },
    [apiUrl, hasUrlChanged]
  )

  const changeNetwork = () => {
    _selectUrl();
    onApply();
  }

  return (
    <StyledDiv className={``}>
      <div
        className={`endpointSection${isChild ? ' isChild' : ''}`}
        onClick={isUnreachable ? undefined : changeNetwork}
      >
        <ChainImg
          className='endpointIcon'
          isInline
          logo={ui.logo || 'empty'}
          withoutHl
        />
        <div className='endpointValue'>
          <div>{name}</div>
        </div>
      </div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  border: 1px solid var(--border-table);
  border-radius: 1rem;
  cursor: pointer;
  margin: 0 0 2rem 0;
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  position: relative;

  &.isUnreachable {
    opacity: var(--opacity-light);
  }

  &.isSelected,
  &:hover {
    background: var(--bg-menu);
  }

  .endpointSection {
    align-items: center;
    display: flex;
    justify-content: flex-start;
    position: relative;

    &+.ui--Toggle {
      margin-top: 1rem;
    }

    &.isChild .endpointIcon {
      margin-left: 1.25rem;
    }

    &+.endpointProvider {
      margin-top: -0.125rem;
    }

    .endpointValue {
      .endpointExtra {
        font-size: var(--font-size-small);
        opacity: var(--opacity-light);
      }
    }
  }

  // we jiggle our labels somewhat...
  label {
    font-size: var(--font-size-small);
    font-weight: var(--font-weight-normal);
    text-transform: none;
  }
`;

export default React.memo(NetworkDisplay);
