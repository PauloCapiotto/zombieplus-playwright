import { test as base, expect } from '@playwright/test'

import { Leads } from './actions/Leads'
import { LoginPage } from './actions/Login'
import { MoviesPage } from './actions/Movies'
import { Popup } from './actions/Components'
import { Api } from './API/index.js';

export const test = base.extend({

  page: async ({ page }, use) => {

    const context = page

    context['Leads'] = new Leads(page)
    context['login'] = new LoginPage(page)
    context['movies'] = new MoviesPage(page)
    context['popup'] = new Popup(page)

    await use(context)

  },

  request: async ({ request }, use) => {

    const context = request
    context['api'] = new Api(request)
    await context['api'].setToken()

    await use(context)

  }

})

export { expect }
