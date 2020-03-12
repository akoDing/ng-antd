export const Regex = {
    /**电子邮箱验证 */
    EMAIL: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/,
    PHILIPSEMAIL: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@philips+(\.com+)+$/,
    /**整数验证 */
    INT: /^\d+$/,
    /**浮点数验证 */
    FLOAT: /^\d+(\.\d+)?$/,
    /**电话号码验证 */
    MOBILE: /^(1\d{10})$/,
    /**固话验证 */
    PHONE: /^(0\d{2}-\d{8}(-\d{1,4})?)|(0\d{3}-\d{7,8}(-\d{1,4})?)$/
};