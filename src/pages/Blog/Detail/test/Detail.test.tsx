import React from 'react'
import { ROUTE_PATHS } from 'routes'
import { App } from 'app'
import { waitForElement } from '@testing-library/react'
import { COMPONENT_LOADER_TEST_ID } from 'components/Loader'
import { COMPONENT_ERROR_ALERT_TEST_ID } from 'components/ErrorAlert'
import { renderWithRouter } from 'test-utils/render'
import {
  mockMeError,
  mockMeSuccess,
  mockPageDetailSuccess,
} from 'test-utils/gql/listPages'
import { createPageWithUser, createUser } from 'test-utils/generators'
import { COMPONENT_PAGE_CARD_TEST_ID } from 'modules/blog/components/PageCard'

describe('[page] Detail', () => {
  it('should render correctly', () => {
    const renderer = renderWithRouter(<App />, ROUTE_PATHS.blog.detail('1'))
    const spinnerElement = renderer.getByTestId(COMPONENT_LOADER_TEST_ID)
    expect(spinnerElement).toBeTruthy()
  })

  describe('when loaded', () => {
    it('should handle error state', async () => {
      const { getByTestId } = renderWithRouter(
        <App />,
        ROUTE_PATHS.blog.detail('1'),
        [mockMeError()]
      )

      await waitForElement(() => getByTestId(COMPONENT_ERROR_ALERT_TEST_ID))
      expect(getByTestId(COMPONENT_ERROR_ALERT_TEST_ID)).toBeTruthy()
    })

    it('should handle success state', async () => {
      const expectedPageData = createPageWithUser(1, 1, [1, 2, 3])
      const expectedMeData = createUser(2)

      const { getAllByTestId, getByText } = renderWithRouter(
        <App />,
        ROUTE_PATHS.blog.detail('1'),
        [mockMeSuccess(expectedMeData), mockPageDetailSuccess(expectedPageData)]
      )

      await waitForElement(() => getByText(expectedPageData.title))

      expect(getByText(expectedPageData.title)).toBeTruthy()
      expect(getAllByTestId(COMPONENT_PAGE_CARD_TEST_ID).length).toEqual(
        expectedPageData.user.pages.length - 1
      )
    })
  })
})