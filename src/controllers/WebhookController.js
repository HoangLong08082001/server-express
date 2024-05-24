const { setTimeout, setInterval } = require("timers");
const request = require("request");
const axios = require("axios");
const WebSocket = require("ws");
const { response } = require("express");
import pool from "../config/database";
import WebhookModal from "../models/WebhookModal";
const dotenv = require("dotenv");
dotenv.config();

//Orders
const getOrders = async (req, res) => {
  try {
    // Thực hiện yêu cầu HTTP sử dụng axios
    await axios
      .get(`https://apecspaceglobal.mysapo.net/admin/orders.json`, {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9", // API Key
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b", // API Secret
        },
      })
      .then((response) => {
        // Kiểm tra và xử lý dữ liệu
        // Xử lý dữ liệu 'billing_address' ở đây
        // setInterval(() => {
        //   console.log(response.data.orders[0].customer);
        // }, 1000);
        // let objuser = response.data.orders[1].user;
        // let objitems = response.data.orders[1].line_items;
        // let mergedObj = Object.assign({}, objuser, objitems);

        // console.log(mergedObj);
        // for (let i = 0; i < response.data.orders.length; i++) {
        //   console.log(
        //     Object.assign(
        //       {},
        //       response.data.orders[i].user,
        //       response.data.orders[i].line_items
        //     )
        //   );
        //   return res.send(
        //     Object.assign(
        //       {},
        //       response.data.orders[i].user,
        //       response.data.orders[i].line_items
        //     )
        //   );
        // }
        //paid fulfilled open
        const mapValues = response.data.orders.map((item) => [
          item.id,
          item.financial_status,
          item.fulfillment_status,
          item.status,
          item.landing_site,
        ]);
        if (mapValues) {
          const query = `
          INSERT INTO orders (id_orders_sapo, financial_status, fulfillment_status, status, referral_link)
          VALUES ?
          ON DUPLICATE KEY UPDATE
          id_orders_sapo = VALUES(id_orders_sapo),
          financial_status = VALUES(financial_status),
          fulfillment_status = VALUES(fulfillment_status),
          status = VALUES(status),
          referral_link = VALUES(referral_link)
        `;
          pool.query(query, [mapValues], (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result) {
              return res.status(200).json(response.data);
            }
          });
        }
      });
    // Trả về dữ liệu từ API
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getOrderById = async (req, res) => {
  let id = req.params.orders_id;
  try {
    // Thực hiện yêu cầu HTTP sử dụng axios
    await axios
      .get(`https://apecspaceglobal.mysapo.net/admin/orders/${id}.json`, {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9", // API Key
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b", // API Secret
        },
      })
      .then((response) => {
        // Kiểm tra và xử lý dữ liệu
        // Xử lý dữ liệu 'billing_address' ở đây
        // setInterval(() => {
        //   console.log(response.data.orders[0].customer);
        // }, 1000);
        let objuser = response.data.order.customer;
        let objitems = response.data;
        let mergedObj = Object.assign({}, objuser, objitems);
        //     const query = `
        //   INSERT INTO orders (id_orders_sapo, financial_status, fulfillment_status, status_orders)
        //   VALUES (?, ?, ?, ?)
        //   ON DUPLICATE KEY UPDATE
        //   id_orders_sapo = VALUES(id_orders_sapo),
        //   financial_status = VALUES(financial_status),
        //   fulfillment_status = VALUES(fulfillment_status),
        //   status_orders = VALUES(status_orders)
        // `;
        //     pool.query(
        //       query,
        //       [
        //         objitems.order.id,
        //         objitems.order.financial_status,
        //         objitems.order.fulfillment_status,
        //         objitems.order.status_orders,
        //       ],
        //       (err, result) => {
        //         if (err) {
        //           console.log(err);
        //         } else {
        //           console.log(result);
        //         }
        //       }
        //     );
        return res.status(200).send(objitems);
      });
    // Trả về dữ liệu từ API
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getOrderTotal = async (req, res) => {
  try {
    // Thực hiện yêu cầu HTTP sử dụng axios
    await axios
      .get(`https://apecspaceglobal.mysapo.net/admin/orders/count.json`, {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9", // API Key
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b", // API Secret
        },
      })
      .then((response) => {
        // Kiểm tra và xử lý dữ liệu
        // Xử lý dữ liệu 'billing_address' ở đây
        // setInterval(() => {
        //   console.log(response.data.orders[0].customer);
        // }, 1000);
        let total = response.data.count;
        return res.status(200).json(response.data);
      });

    // Trả về dữ liệu từ API
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

//Customers
const getCustomers = async (req, res) => {
  try {
    // Thực hiện yêu cầu HTTP sử dụng axios
    await axios
      .get(`https://apecspaceglobal.mysapo.net/admin/customers.json`, {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9", // API Key
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b", // API Secret
        },
      })
      .then((response) => {
        // Kiểm tra và xử lý dữ liệu
        // Xử lý dữ liệu 'billing_address' ở đây
        // setInterval(() => {
        //   console.log(response.data.orders[0].customer);
        // }, 1000);
        let total = response.data;
        console.log(total);
        return res.status(200).json(total);
      });
    // Trả về dữ liệu từ API
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getCustomerById = async (req, res) => {
  let id = req.params.customers_id;
  try {
    // Thực hiện yêu cầu HTTP sử dụng axios
    await axios
      .get(`https://apecspaceglobal.mysapo.net/admin/customers/${id}.json`, {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9", // API Key
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b", // API Secret
        },
      })
      .then((response) => {
        // Kiểm tra và xử lý dữ liệu
        // Xử lý dữ liệu 'billing_address' ở đây
        // setInterval(() => {
        //   console.log(response.data.orders[0].customer);
        // }, 1000);
        let total = response.data;
        return res.status(200).json(total);
      });
    // Trả về dữ liệu từ API
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getTotalCustomers = async (req, res) => {
  try {
    // Thực hiện yêu cầu HTTP sử dụng axios
    await axios
      .get(`https://apecspaceglobal.mysapo.net/admin/customers/count.json`, {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9", // API Key
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b", // API Secret
        },
      })
      .then((response) => {
        // Kiểm tra và xử lý dữ liệu
        // Xử lý dữ liệu 'billing_address' ở đây
        // setInterval(() => {
        //   console.log(response.data.orders[0].customer);
        // }, 1000);
        let total = response.data.count;
        return res.status(200).json(response.data);
      });
    // Trả về dữ liệu từ API
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

//Customers address
const getCustomersAddress = async (req, res) => {
  let idCustommer = req.params.customers_id;
  try {
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/customers/${idCustommer}/addresses.json`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9", // API Key
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b", // API Secret
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getCustomersIdAddressId = async (req, res) => {
  let idCustommer = req.params.customers_id;
  let idAddress = req.params.address_id;
  try {
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/customers/${idCustommer}/addresses/${idAddress}.json`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9", // API Key
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b", // API Secret
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

//Stores
const getStores = async (req, res) => {
  try {
    // Thực hiện yêu cầu HTTP sử dụng axios
    await axios
      .get(`https://apecspaceglobal.mysapo.net/admin/store.json`, {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9", // API Key
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b", // API Secret
        },
      })
      .then((response) => {
        // Kiểm tra và xử lý dữ liệu
        // Xử lý dữ liệu 'billing_address' ở đây
        // setInterval(() => {
        //   console.log(response.data.orders[0].customer);
        // }, 1000);
        let total = response.data;
        console.log(total);
        return res.status(200).json(total);
      });
    // Trả về dữ liệu từ API
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

//Products
const getProducts = async (req, res) => {
  try {
    // Thực hiện yêu cầu HTTP sử dụng axios
    await axios
      .get(`https://apecspaceglobal.mysapo.net/admin/products.json`, {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9", // API Key
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b", // API Secret
        },
      })
      .then((response) => {
        // Kiểm tra và xử lý dữ liệu
        // Xử lý dữ liệu 'billing_address' ở đây
        // setInterval(() => {
        //   console.log(response.data.orders[0].customer);
        // }, 1000);
        let total = response.data;
        const mapValue = response.data.products.map((item) => [
          item.id,
          item.name,
          item.content,
          item.variants,
        ]);
        const query = ` INSERT INTO products (id_products_sapo,	name_products,	description,	price_products)
          VALUES ?
          ON DUPLICATE KEY UPDATE
          id_products_sapo = VALUES(id_products_sapo),
          name_products = VALUES(name_products),
          description = VALUES(description),
          price_products = VALUES(price_products)`;
        pool.query(query, [mapValue], (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
          }
        });
        return res.status(200).json(total);
      });
    // Trả về dữ liệu từ API
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getProductById = async (req, res) => {
  let id = req.params.products_id;
  try {
    // Thực hiện yêu cầu HTTP sử dụng axios
    await axios
      .get(`https://apecspaceglobal.mysapo.net/admin/products/${id}.json`, {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9", // API Key
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b", // API Secret
        },
      })
      .then((response) => {
        // Kiểm tra và xử lý dữ liệu
        // Xử lý dữ liệu 'billing_address' ở đây
        // setInterval(() => {
        //   console.log(response.data.orders[0].customer);
        // }, 1000);
        let total = response.data;
        return res.status(200).json(total);
      });
    // Trả về dữ liệu từ API
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getProductTotal = async (req, res) => {
  try {
    // Thực hiện yêu cầu HTTP sử dụng axios
    await axios
      .get(`https://apecspaceglobal.mysapo.net/admin/products/count.json`, {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9", // API Key
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b", // API Secret
        },
      })
      .then((response) => {
        // Kiểm tra và xử lý dữ liệu
        // Xử lý dữ liệu 'billing_address' ở đây
        // setInterval(() => {
        //   console.log(response.data.orders[0].customer);
        // }, 1000);
        let total = response.data.count;
        return res.status(200).json(response.data);
      });
    // Trả về dữ liệu từ API
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

//collect
const getCollects = async (req, res) => {
  try {
    // Thực hiện yêu cầu HTTP sử dụng axios
    await axios
      .get(`https://apecspaceglobal.mysapo.net/admin/collects.json`, {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9", // API Key
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b", // API Secret
        },
      })
      .then((response) => {
        // Kiểm tra và xử lý dữ liệu
        // Xử lý dữ liệu 'billing_address' ở đây
        // setInterval(() => {
        //   console.log(response.data.orders[0].customer);
        // }, 1000);
        let total = response.data;
        console.log(total);
        return res.status(200).json(total);
      });
    // Trả về dữ liệu từ API
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getCollectById = async (req, res) => {
  let id = req.params.collects_id;
  try {
    // Thực hiện yêu cầu HTTP sử dụng axios
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/collects.json?product_id=${id}`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9", // API Key
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b", // API Secret
          },
        }
      )
      .then((response) => {
        // Kiểm tra và xử lý dữ liệu
        // Xử lý dữ liệu 'billing_address' ở đây
        // setInterval(() => {
        //   console.log(response.data.orders[0].customer);
        // }, 1000);
        let total = response.data;
        return res.status(200).json(total);
      });
    // Trả về dữ liệu từ API
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getCollectsTotal = async (req, res) => {
  try {
    await axios
      .get(`https://apecspaceglobal.mysapo.net/admin/collects/count.json`, {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9", // API Key
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b", // API Secret
        },
      })
      .then((response) => {
        return res.send(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

//Custom collect
const getCustomCollects = async (req, res) => {
  try {
    await axios
      .get(`https://apecspaceglobal.mysapo.net/admin/custom_collections.json`, {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9", // API Key
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b", // API Secret
        },
      })
      .then((response) => {
        console.log(response.data);
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getCustomCollectsId = async (req, res) => {
  let idCustomCollect = req.params.custom_collect_id;
  try {
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/custom_collections/${idCustomCollect}.json`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9", // API Key
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b", // API Secret
          },
        }
      )
      .then((response) => {
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getCustomCollectsTotal = async (req, res) => {
  let product_id = req.params.products_id;
  try {
    if (product_id) {
      await axios
        .get(
          `https://apecspaceglobal.mysapo.net/admin/custom_collections/count.json?product_id=${product_id}`,
          {
            auth: {
              username: "bba3469777fb4483a01c60fe868000e9", // API Key
              password: "c1bf8ecbbfe444e0aeaab6aef336aa3b", // API Secret
            },
          }
        )
        .then((response) => {
          console.log(response.data);
        });
    }
    if (!product_id) {
      await axios
        .get(
          `https://apecspaceglobal.mysapo.net/admin/custom_collections/count.json`,
          {
            auth: {
              username: "bba3469777fb4483a01c60fe868000e9", // API Key
              password: "c1bf8ecbbfe444e0aeaab6aef336aa3b", // API Secret
            },
          }
        )
        .then((response) => {
          console.log(response.data);
        });
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
  return res.send("collect custom total");
};

//Events
const getEvents = async (req, res) => {
  try {
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/events.json
`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9", // API Key
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b", // API Secret
          },
          headers: {
            Authorization: "b18ebd508aee4afdb910d9420326c63d",
          },
        }
      )
      .then((response) => {
        console.log(response);
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getCustomCollectsEvents = async (req, res) => {
  let custom_collections_id = req.params.custom_collect_events_id;
  try {
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/custom_collections/${custom_collections_id}/events.json`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9",
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
          },
        }
      )
      .then((response) => {
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getOrdersEvents = async (req, res) => {
  let orders_id = req.params.orders_id;
  try {
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/orders/${orders_id}/events.json`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9",
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
          },
        }
      )
      .then((response) => {
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getProductsEvents = async (req, res) => {
  let products_id = req.params.products_id;
  try {
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/products/${products_id}/events.json`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9",
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
          },
        }
      )
      .then((response) => {
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getEventsTotal = async (req, res) => {
  try {
    await axios
      .get(`https://apecspaceglobal.mysapo.net/admin/events/count.json`, {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9",
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
        },
      })
      .then((response) => {
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

//Fulfillment
const getFulfillment = async (req, res) => {
  let orders_id = req.params.orders_id;
  try {
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/orders/${orders_id}/fulfillments.json`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9",
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
          },
        }
      )
      .then((response) => {
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getFulfillmentById = async (req, res) => {
  let orders_id = req.params.orders_id;
  let fulfillment_id = req.params.fulfillment_id;
  try {
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/orders/${orders_id}/fulfillments/${fulfillment_id}.json`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9",
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
          },
        }
      )
      .then((response) => {
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getFulfillmentTotal = async (req, res) => {
  let orders_id = req.params.orders_id;
  try {
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/orders/${orders_id}/fulfillments/count.json`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9",
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
          },
        }
      )
      .then((response) => {
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

//Metafields
const getMetafields = async (req, res) => {
  try {
    await axios
      .get(`https://apecspaceglobal.mysapo.net/admin/metafields.json`, {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9",
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
        },
      })
      .then((response) => {
        console.log(response.data);
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getCustomCollectMetafields = async (req, res) => {
  let custom_collection_id = req.params.custom_collection_id;
  try {
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/custom_collections/${custom_collection_id}/metafields.json`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9",
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
          },
        }
      )
      .then((response) => {
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getCustomersMetafields = async (req, res) => {
  let customers_id = req.params.customers_id;
  try {
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/customers/${customers_id}/metafields.json`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9",
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
          },
        }
      )
      .then((response) => {
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getOrdersMetafields = async (req, res) => {
  let orders_id = req.params.orders_id;
  try {
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/orders/${orders_id}/metafields.json`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9",
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
          },
        }
      )
      .then((response) => {
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getProductsMetafields = async (req, res) => {
  let products_id = req.params.products_id;
  try {
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/products/${products_id}/metafields.json`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9",
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
          },
        }
      )
      .then((response) => {
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getMetafieldTotal = async (req, res) => {
  try {
    await axios
      .get(`https://apecspaceglobal.mysapo.net/admin/metafields/count.json`, {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9",
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
        },
      })
      .then((response) => {
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getProductsByIdMetafields = async (req, res) => {
  try {
    await axios
      .get(`https://apecspaceglobal.mysapo.net/admin/metafields/count.json`, {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9",
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
        },
      })
      .then((response) => {
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

//Price rule
const getPriceRule = async (req, res) => {
  try {
    await axios
      .get(`https://apecspaceglobal.mysapo.net/admin/price_rules.json`, {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9",
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
        },
      })
      .then((response) => {
        console.log(response.data);
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getPriceRuleById = async (req, res) => {
  let priceRule_id = req.params.priceRule_id;
  try {
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/price_rules/${priceRule_id}.json`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9",
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
          },
        }
      )
      .then((response) => {
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

//Refund
const getRefund = async (req, res) => {
  let orders_id = req.params.orders_id;
  try {
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/orders/${orders_id}/refunds.json`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9",
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
          },
        }
      )
      .then((response) => {
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

//Transaction
const getTransaction = async (req, res) => {
  let orders_id = req.params.orders_id;
  try {
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/orders/${orders_id}/transactions.json`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9",
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getTransactionById = async (req, res) => {
  let orders_id = req.params.orders_id;
  let transaction_id = req.params.transaction_id;
  try {
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/orders/${orders_id}/transactions/${transaction_id}.json`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9",
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
  return res.send("transactions by id");
};
const getTransactionTotal = async (req, res) => {
  let orders_id = req.params.orders_id;
  try {
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/orders/${orders_id}/transactions/count.json`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9",
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
          },
        }
      )
      .then((response) => {
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

//Carrie Services
const getCarrierServices = async (req, res) => {
  try {
    await axios
      .get(`https://apecspaceglobal.mysapo.net/admin/carrier_services.json`, {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9",
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
        },
      })
      .then((response) => {
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getCarrierServicesById = async (req, res) => {
  let carrier_services_id = req.params.carrier_services_id;
  try {
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/carrier_services/${carrier_services_id}.json`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9",
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
  return res.send("carrier service");
};

//Redirect
const getRedirect = async (req, res) => {
  try {
    await axios
      .get(`https://apecspaceglobal.mysapo.net/admin/redirects.json`, {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9",
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
        },
      })
      .then((response) => {
        console.log(response.data);
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getRedirectById = async (req, res) => {
  let redirect_id = req.params.redirect_id;
  try {
    await axios
      .get(
        `https://apecspaceglobal.mysapo.net/admin/redirects/${redirect_id}.json`,
        {
          auth: {
            username: "bba3469777fb4483a01c60fe868000e9",
            password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getRedirectTotal = async (req, res) => {
  try {
    await axios
      .get(`https://apecspaceglobal.mysapo.net/admin/redirects/count.json`, {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9",
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
        },
      })
      .then((response) => {
        console.log(response.data.count);
        return res.status(200).json(response.data);
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

//Variants
const getVariants = async (req, res) => {
  try {
    await axios
      .get("https://apecspaceglobal.mysapo.net/admin/variants.json", {
        auth: {
          username: "bba3469777fb4483a01c60fe868000e9",
          password: "c1bf8ecbbfe444e0aeaab6aef336aa3b",
        },
      })
      .then((response) => {
        const mapValue = response.data.variants.map((item) => [
          item.sku,
          item.price,
        ]);
        const query = ` INSERT INTO products (id_products_sapo,	price)
          VALUES ?
          ON DUPLICATE KEY UPDATE
          id_products_sapo = VALUES(id_products_sapo),
          price = VALUES(price)`;
        pool.query(query, [mapValue], (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result) {
            setInterval(() => {
              return res.status(200).json(response.data);
            }, 2000);
          }
        });
      });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
module.exports = {
  getOrders,
  getOrderById,
  getOrderTotal,
  getCustomers,
  getCustomerById,
  getTotalCustomers,
  getStores,
  getProducts,
  getProductById,
  getProductTotal,
  getCollects,
  getCollectById,
  getCollectsTotal,
  getCustomersAddress,
  getCustomersIdAddressId,
  getCustomCollects,
  getCustomCollectsId,
  getCustomCollectsTotal,
  getEvents,
  getCustomCollectsEvents,
  getOrdersEvents,
  getProductsEvents,
  getFulfillment,
  getFulfillmentById,
  getFulfillmentTotal,
  getMetafields,
  getCustomCollectMetafields,
  getCustomersMetafields,
  getOrdersMetafields,
  getProductsMetafields,
  getPriceRule,
  getPriceRuleById,
  getRefund,
  getTransaction,
  getTransactionById,
  getTransactionTotal,
  getCarrierServices,
  getCarrierServicesById,
  getMetafieldTotal,
  getProductsByIdMetafields,
  getEventsTotal,
  getRedirect,
  getRedirectById,
  getRedirectTotal,
  getVariants,
};
