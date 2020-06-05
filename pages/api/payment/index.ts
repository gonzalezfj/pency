import {NextApiRequest, NextApiResponse} from "next";
import shortid from "shortid";

import {ClientTenant} from "~/tenant/types";
import tenantCache from "~/tenant/cache";
import api from "~/tenant/api/server";
import {CartItem} from "~/cart/types";
import paymentsApi from "~/payment/api/server";

interface PostRequest extends NextApiRequest {
  body: {
    items: CartItem[];
    slug: ClientTenant["slug"];
  };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const {
      body: {slug, items},
    } = req as PostRequest;

    if (!items?.length) return res.status(304).end();

    const cached = tenantCache.get(slug);

    if (cached?.mercadopago?.token) {
      return paymentsApi
        .create(items, slug, cached.mercadopago.token)
        .then((url) => res.status(200).json({url}))
        .catch(({status, statusText}) => res.status(status).end(statusText));
    }

    return api
      .fetch(slug)
      .then((tenant) =>
        paymentsApi
          .create(items, slug, tenant.mercadopago.token)
          .then((url) => res.status(200).json({url})),
      )
      .catch(({status, statusText}) => res.status(status).end(statusText));
  }

  return res.status(304).end();
};