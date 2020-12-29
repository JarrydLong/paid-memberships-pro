jQuery(document).ready(function() {
    //set up braintree encryption
    // var braintree = Braintree.create( pmpro_braintree.encryptionkey );
    // braintree.onSubmitEncryptForm('pmpro_form');

    //pass expiration dates in original format
    function pmpro_updateBraintreeCardExp()
    {
        jQuery('#credit_card_exp').val(jQuery('#ExpirationMonth').val() + "/" + jQuery('#ExpirationYear').val());
    }
    jQuery('#ExpirationMonth, #ExpirationYear').change(function() {
        pmpro_updateBraintreeCardExp();
    });
    pmpro_updateBraintreeCardExp();

    //pass last 4 of credit card
    function pmpro_updateBraintreeAccountNumber()
    {
        jQuery('#BraintreeAccountNumber').val('XXXXXXXXXXXXX' + jQuery('#AccountNumber').val().substr(jQuery('#AccountNumber').val().length - 4));
    }
    jQuery('#AccountNumber').change(function() {
        pmpro_updateBraintreeAccountNumber();
    });
    // pmpro_updateBraintreeAccountNumber();

    console.log(pmpro_braintree.encryptionkey);

    // braintree.client.create({
    //   authorization: pmpro_braintree.encryptionkey
    // }, function (err, clientInstance) {
    //     var form = document.getElementById('pmpro_form');
    //     var deviceDataInput = form['pmpro_bt_device_data'];

    //     if (deviceDataInput == null) {
    //       deviceDataInput = document.createElement('input');
    //       deviceDataInput.name = 'pmpro_bt_device_data';
    //       deviceDataInput.type = 'text';
    //       form.appendChild(deviceDataInput);
    //     }

    // });


    braintree.client.create({
      authorization: pmpro_braintree.clienttoken
    }, function (err, clientInstance) {
      // Creation of any other components...
      console.log(err);

       var form = document.getElementById('pmpro_form');
      var data = {
        creditCard: {
          number: form['BraintreeAccountNumber'].value,
          cvv: form['CVV'].value,
          expirationDate: form['cc-expiration-date'].value,
          // billingAddress: {
          //   postalCode: form['cc-postal-code'].value
          // },
          // options: {
          //   validate: false
          // }
        }
      };
      console.log(clientInstance);
      braintree.dataCollector.create({
        client: clientInstance,
        paypal: true
      }, function (err, dataCollectorInstance) {
        if (err) {
            console.log(err);
          // Handle error in creation of data collector
          return;
        }
        // At this point, you should access the dataCollectorInstance.deviceData value and provide it
        // to your server, e.g. by injecting it into your form as a hidden input.
        var deviceData = dataCollectorInstance.deviceData;
        console.log(deviceData);
        if( deviceData ){
            var data = JSON.parse( deviceData );
            jQuery("#pmpro_bt_device_data").val(data.correlation_id);
        }
      });
    });
});