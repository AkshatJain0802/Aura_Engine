const { Product } = require('../models/Product');

async function getAnalytics(_req, res) {
  const pipeline = [
    { $match: {} },
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              totalRecords: { $sum: 1 },
              totalStock: { $sum: '$stockQuantity' },
              totalValuation: { $sum: { $multiply: ['$price', '$stockQuantity'] } },
              lowStockSkus: {
                $sum: {
                  $cond: [{ $lte: ['$stockQuantity', '$reorderLevel'] }, 1, 0]
                }
              }
            }
          },
          {
            $project: {
              _id: 0,
              totalRecords: 1,
              totalStock: 1,
              totalValuation: { $round: ['$totalValuation', 2] },
              lowStockSkus: 1
            }
          }
        ],
        byCategory: [
          {
            $group: {
              _id: '$category',
              totalProducts: { $sum: 1 },
              totalStock: { $sum: '$stockQuantity' },
              totalValuation: { $sum: { $multiply: ['$price', '$stockQuantity'] } },
              lowStockCount: {
                $sum: {
                  $cond: [{ $lte: ['$stockQuantity', '$reorderLevel'] }, 1, 0]
                }
              }
            }
          },
          {
            $project: {
              _id: 0,
              category: '$_id',
              totalProducts: 1,
              totalStock: 1,
              totalValuation: { $round: ['$totalValuation', 2] },
              lowStockCount: 1
            }
          },
          { $sort: { totalValuation: -1 } }
        ]
      }
    },
    {
      $project: {
        totals: {
          $ifNull: [
            { $first: '$totals' },
            { totalRecords: 0, totalStock: 0, totalValuation: 0, lowStockSkus: 0 }
          ]
        },
        byCategory: 1
      }
    }
  ];

  const [result] = await Product.aggregate(pipeline);

  res.json({
    ...result,
    updatedAt: new Date().toISOString()
  });
}

module.exports = { getAnalytics };
