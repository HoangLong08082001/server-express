const express = require("express");
import WebhookController from "../controllers/WebhookController";
const router = express.Router();
export default function WebhookRoute(app) {
  //orders
  router.get("/orders", WebhookController.getOrders);
  router.get("/orders-by-id/:orders_id", WebhookController.getOrderById);
  router.get("/orders-total", WebhookController.getOrderTotal);
  //customers
  router.get("/customers", WebhookController.getCustomers);
  router.get(
    "/customer-by-id/:customers_id",
    WebhookController.getCustomerById
  );
  router.get("/customers-total", WebhookController.getTotalCustomers);
  //customers address
  router.get(
    "/custommer-address/:customers_id",
    WebhookController.getCustomersAddress
  );
  router.get(
    "/customerId/:customers_id/addressId/:address_id",
    WebhookController.getCustomersIdAddressId
  );
  //store
  router.get("/store", WebhookController.getStores);
  //products
  router.get("/products", WebhookController.getProducts);
  router.get("/product-by-id/:products_id", WebhookController.getProductById);
  router.get("/products-total", WebhookController.getProductTotal);
  //collects
  router.get("/collects", WebhookController.getCollects);
  router.get("/collect-by-id/:collects_id", WebhookController.getCollectById);
  router.get("/collects-total", WebhookController.getCollectsTotal);
  //Custom collection
  router.get("/custom-collect", WebhookController.getCustomCollects);
  router.get(
    "/custom-collect-by-id/:custom_collect_id",
    WebhookController.getCustomCollectsId
  );
  router.get(
    "/custom-collect-total/:products_id",
    WebhookController.getCustomCollectsTotal
  );
  //Events
  router.get("/all-events", WebhookController.getEvents);
  router.get(
    "/events-custom-collects/:custom_collect_events_id",
    WebhookController.getCustomCollectsEvents
  );
  router.get("/events-orders/:orders_id", WebhookController.getOrdersEvents);
  router.get(
    "/events-products/:products_id",
    WebhookController.getProductsEvents
  );
  router.get("/events-total", WebhookController.getEventsTotal);
  //Fulfillment
  router.get("/fulfillment/:orders_id", WebhookController.getFulfillment);
  router.get(
    "/fulfillment-by-id/:orders_id/:fulfillment_id",
    WebhookController.getFulfillmentById
  );
  router.get(
    "/fulfillment-total/:orders_id",
    WebhookController.getFulfillmentTotal
  );
  //Metafields
  router.get("/metafields", WebhookController.getMetafields);
  router.get(
    "/metafields-custom-collect/:custom_collection_id",
    WebhookController.getCustomCollectMetafields
  );
  router.get(
    "/metafields-customers/:customers_id",
    WebhookController.getCustomersMetafields
  );
  router.get(
    "/metafields-orders/:orders_id",
    WebhookController.getOrdersMetafields
  );
  router.get(
    "/metafields-products/:products_id",
    WebhookController.getProductsMetafields
  );
  router.get(
    "/metafields-products-by-id",
    WebhookController.getProductsByIdMetafields
  ); //delay
  router.get("/metafields-total", WebhookController.getMetafieldTotal);
  //price rule
  router.get("/price-rule", WebhookController.getPriceRule);
  router.get(
    "/price-rule-by-id/:priceRule_id",
    WebhookController.getPriceRuleById
  ); //delay
  //Refunds
  router.get("/refund/:orders_id", WebhookController.getRefund);
  //Transaction
  router.get("/transaction/:orders_id", WebhookController.getTransaction);
  router.get(
    "/transaction-by-id/:orders_id/:transaction_id",
    WebhookController.getTransactionById
  ); //delay
  router.get(
    "/transaction-total/:orders_id",
    WebhookController.getTransactionTotal
  );
  //Carrier Service
  router.get("/carrier-service", WebhookController.getCarrierServices);
  router.get(
    "/carrier-service-by-id/:carrier_services_id",
    WebhookController.getCarrierServicesById
  ); //delay
  //Redirect
  router.get("/redirect", WebhookController.getRedirect);
  router.get("/redirect-by-id/:redirect_id", WebhookController.getRedirectById); //delay
  router.get("/redirect-total", WebhookController.getRedirectTotal);
  //Variant
  router.get("/products-variant", WebhookController.getVariants);
  return app.use("/webhook", router);
}
